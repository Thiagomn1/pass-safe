import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/types";
import { userParseSchema } from "../validation/userSchemas";

const SECRET_KEY = process.env.JWT_SECRET;

class UserController {
  static getMe = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const decoded = jwt.verify(token, SECRET_KEY!) as { userId: string };
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  static createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = userParseSchema.parse(req.body);

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id, username }, SECRET_KEY!, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
      });
      res.status(201).json({
        message: "User created and logged in successfully",
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  };

  static loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username, password } = userParseSchema.parse(req.body);
      const user = await User.findOne({ username });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user._id, username }, SECRET_KEY!, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login successful",
          user,
        });
    } catch (error) {
      next(error);
    }
  };

  static logoutUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res
        .clearCookie("token", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
