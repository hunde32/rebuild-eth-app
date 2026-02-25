import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  txRef: string; // Chapa transaction reference
  amount: number;
  currency: string;
  blockchainTxHash?: string;
  status: "pending" | "success" | "failed";
}

const DonationSchema = new Schema(
  {
    txRef: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "ETB" },
    blockchainTxHash: { type: String }, // Populated after Ethers.js records it
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDonation>("Donation", DonationSchema);
