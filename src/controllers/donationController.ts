import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import crypto from "crypto";
import Donation from "../models/Donation";
import { recordDonationOnChain } from "../services/blockchain";

export const initializePayment = async (req: Request, res: Response) => {
  const { amount, email, firstName, lastName } = req.body;
  const txRef = `REBUILD-${Date.now()}`;

  try {
    await Donation.create({ txRef, amount, status: "pending" });

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
      const txHash = await recordDonationOnChain(tx_ref, amount);

      await Donation.findOneAndUpdate(
        { txRef: tx_ref },
        { status: "success", blockchainTxHash: txHash },
      );
    } catch (error) {
      console.error("Failed to post to blockchain", error);
    }
  }

  res.status(200).send("Webhook received");
};

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
