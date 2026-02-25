import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  (req as any).user = session.user;
  (req as any).session = session.session;
  next();
};

export const requireEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  const userEmail = session.user.email;
  if (!userEmail.endsWith("@rebuildeth.com")) {
    return res.status(403).json({ message: "Forbidden: Employees only." });
  }

  (req as any).user = session.user;
  next();
};
