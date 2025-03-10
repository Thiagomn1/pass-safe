import { Response } from "express";
import passwordGenerator from "../utils/passwordGenerator";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/types";

class PasswordController {
  static getSavedPasswords = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = await User.findById(req?.user?.userId)
        .select("savedPasswords")
        .lean();

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const passwordsWithoutId = user.savedPasswords.map(
        ({ _id, ...password }) => password
      );

      res.status(200).json(passwordsWithoutId);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static generatePassword = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { length, site } = req.body;

    if (!length || isNaN(length) || length <= 0) {
      res
        .status(400)
        .json({ error: "Invalid length. Provide a positive integer." });
    }

    if (!site || typeof site !== "string") {
      res
        .status(400)
        .json({ error: "Invalid site. Provide a valid site URL or name." });
    }

    const password = passwordGenerator(length);

    const user = await User.findById(req?.user?.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.savedPasswords.push({ site, password });
    await user.save();

    res.status(201).json({ site, password });
  };
}

export default PasswordController;
