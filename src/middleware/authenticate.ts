import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/types";
import { Request, Response, NextFunction } from "express";

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (typeof decoded !== "object" || !decoded.userId || !decoded.username) {
      res.status(400).json({ error: "Invalid token payload" });
      return;
    }

    req.user = {
      userId: decoded.userId as string,
      username: decoded.username as string,
    };
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default authenticate;
