import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- 4. Auth Route ---
// This regex matches /api/auth/ and everything after it.
// It is the only way to avoid the PathError in your version of Node/Express.
app.use("/api/auth", toNodeHandler(auth));

app.use("/api/donations", donationRoutes);
app.use("/api/recipients", recipientRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success" });
});

const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/rebuildeth";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server on http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error("❌ DB Error:", err));
