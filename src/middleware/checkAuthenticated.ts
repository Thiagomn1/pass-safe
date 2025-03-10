import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/types";

const checkAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

export default checkAuthenticated;
