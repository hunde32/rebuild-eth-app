import type { Request, Response, NextFunction } from "express";
import { uploadImage } from "../services/cloudinary";
import { encryptData } from "../utils/encryption";
import Recipient from "../models/Recipient";

export const registerRecipient = async (req: Request, res: Response) => {
  try {
    const { name, idFrontBase64, idBackBase64, selfieBase64 } = req.body;
    const employeeId = req.user?.id; // Assuming BetterAuth populates req.user

    // 1. Upload to Cloudinary
    const idFrontUrl = await uploadImage(idFrontBase64, "kyc_ids");
    const idBackUrl = await uploadImage(idBackBase64, "kyc_ids");
    const selfieUrl = await uploadImage(selfieBase64, "kyc_selfies");

    // 2. Encrypt Data
    const encryptedName = encryptData(name);
    const encryptedIdFront = encryptData(idFrontUrl);
    const encryptedIdBack = encryptData(idBackUrl);
    const encryptedSelfie = encryptData(selfieUrl);

    // 3. Save to Mongo
    const recipient = new Recipient({
      encryptedName,
      encryptedIdFrontUrl: encryptedIdFront,
      encryptedIdBackUrl: encryptedIdBack,
      encryptedSelfieUrl: encryptedSelfie,
      registeredBy: employeeId,
    });

    await recipient.save();
    res.status(201).json({ message: "Recipient registered securely." });
  } catch (error: any) {
    // This will print the EXACT reason in your bun terminal
    console.error("DETAILED ERROR:", error.message);
    console.error("STACK TRACE:", error.stack);

    res.status(500).json({
      message: "Registration failed",
      error: error.message, // Send the real error back to Postman for now
    });
  }
};
