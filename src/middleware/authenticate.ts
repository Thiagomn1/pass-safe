import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/types";

const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token, "@@@@@@@@@@");

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded !== "object") {
      res.status(400).json({ error: "Invalid token payload" });
      return;
    }

    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default authenticate;
