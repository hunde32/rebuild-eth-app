import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js"; // Ensure the .js extension is here too
import { fromNodeHeaders } from "better-auth/node";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Get the session from BetterAuth using the request headers
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // 2. Attach the user to the request object
  // We cast to 'any' here or extend the Express Request type
  (req as any).user = session.user;

  next();
};
