import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/types";

const SECRET_KEY = process.env.JWT_SECRET;

class UserController {
  static getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await User.findById(req.user.userId).select("-password");

      if (!user) {
        res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      if (await User.findOne({ username })) {
        res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static loginUser = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user._id, username }, SECRET_KEY!, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default UserController;
