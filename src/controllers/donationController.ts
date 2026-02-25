import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import crypto from "crypto";
import Donation from "../models/Donation";
import { recordDonationOnChain } from "../services/blockchain";

// Initialize Chapa Payment
export const initializePayment = async (req: Request, res: Response) => {
  const { amount, email, firstName, lastName } = req.body;
  const txRef = `REBUILD-${Date.now()}`;

  try {
    // 1. Save Pending Donation
    await Donation.create({ txRef, amount, status: "pending" });

    // 2. Call Chapa
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
        callback_url: "https://yourfrontend.com/verify", // Frontend redirect
        return_url: "https://yourfrontend.com/success",
      },
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      },
    );

    res.status(200).json(chapaRes.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize payment." });
  }
};

// Handle Chapa Webhook
export const chapaWebhook = async (req: Request, res: Response) => {
  const hash = crypto
    .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET || "")
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["chapa-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const { tx_ref, status, amount } = req.body;

  if (status === "success") {
    try {
      // 1. Post to Blockchain
      const txHash = await recordDonationOnChain(tx_ref, amount);

      // 2. Update DB with success and Hash
      await Donation.findOneAndUpdate(
        { txRef: tx_ref },
        { status: "success", blockchainTxHash: txHash },
      );
    } catch (error) {
      console.error("Failed to post to blockchain", error);
      // Implement a retry queue / DLQ in production here
    }
  }

  res.status(200).send("Webhook received");
};

// Public Verification Endpoint
export const verifyDonation = async (req: Request, res: Response) => {
  const { txHash } = req.params;
  const donation = await Donation.findOne({ blockchainTxHash: txHash });

  if (!donation) {
    return res
      .status(404)
      .json({ error: "Transaction not found in public registry." });
  }

  res.status(200).json({
    amount: donation.amount,
    currency: donation.currency,
    blockchainTxHash: donation.blockchainTxHash,
    status: donation.status,
    explorerLink: `https://explorer.creditcoin.org/tx/${donation.blockchainTxHash}`,
  });
};
