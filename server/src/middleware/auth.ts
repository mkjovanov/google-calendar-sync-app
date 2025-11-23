import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../prisma";

interface JwtPayload {
  sub: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["auth"];
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    (req as any).currentUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
