import { Router } from "express";
import { registerRecipient } from "../controllers/recipientController.js";
import { requireEmployee } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", requireEmployee, registerRecipient);

export default router;
