import { Router } from "express";
import {
  initializePayment,
  chapaWebhook,
  verifyDonation,
} from "../controllers/donationController";

const router = Router();
router.post("/init", initializePayment);
router.post("/webhook", chapaWebhook);
router.get("/verify/:txHash", verifyDonation);

export default router;
