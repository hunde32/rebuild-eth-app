import mongoose, { Schema, Document } from "mongoose";

export interface IRecipient extends Document {
  encryptedName: string;
  encryptedIdFrontUrl: string;
  encryptedIdBackUrl: string;
  encryptedSelfieUrl: string;
  registeredBy: mongoose.Types.ObjectId; // Employee ID
  status: "pending" | "verified" | "rejected";
}

const RecipientSchema = new Schema(
  {
    encryptedName: { type: String, required: true },
    encryptedIdFrontUrl: { type: String, required: true },
    encryptedIdBackUrl: { type: String, required: true },
    encryptedSelfieUrl: { type: String, required: true },
    registeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRecipient>("Recipient", RecipientSchema);
