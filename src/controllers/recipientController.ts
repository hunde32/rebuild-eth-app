import type { Request, Response, NextFunction } from "express";
import { uploadImage } from "../services/cloudinary";
import { encryptData } from "../utils/encryption";
import Recipient from "../models/Recipient";

export const registerRecipient = async (req: Request, res: Response) => {
  try {
    const { name, idFrontBase64, idBackBase64, selfieBase64 } = req.body;
    const employeeId = req.user?.id;

    const idFrontUrl = await uploadImage(idFrontBase64, "kyc_ids");
    const idBackUrl = await uploadImage(idBackBase64, "kyc_ids");
    const selfieUrl = await uploadImage(selfieBase64, "kyc_selfies");

    const encryptedName = encryptData(name);
    const encryptedIdFront = encryptData(idFrontUrl);
    const encryptedIdBack = encryptData(idBackUrl);
    const encryptedSelfie = encryptData(selfieUrl);
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
    console.error("DETAILED ERROR:", error.message);
    console.error("STACK TRACE:", error.stack);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};
