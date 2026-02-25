import { Router } from "express";
import { registerRecipient } from "../controllers/recipientController.js";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.post("/register", protect, registerRecipient);
router.post("/register", registerRecipient);

export default router;
