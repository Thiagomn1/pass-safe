import { Response } from "express";
import passwordGenerator from "../utils/passwordGenerator";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/types";
import { decryptPassword, encryptPassword } from "../utils/encryption";

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
      const decryptedPasswords = user.savedPasswords.map(
        ({ _id, site, password }) => ({
          site,
          password: decryptPassword(password),
        })
      );

      res.status(200).json(decryptedPasswords);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getSitePassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const siteQuery = req.params.site;
      const user = await User.findById(req?.user?.userId)
        .select("savedPasswords")
        .lean();

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const foundPassword = user.savedPasswords.find(({ site }) =>
        site.includes(siteQuery)
      );

      if (!foundPassword) {
        res.status(404).json({ error: "Password not found" });
        return;
      }

      res.status(200).json(foundPassword);
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

    const password = passwordGenerator(length);
    const encryptedPassword = encryptPassword(password);

    const user = await User.findById(req?.user?.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.savedPasswords.push({ site, password: encryptedPassword });
    await user.save();

    res.status(201).json({ site, password });
  };
}

export default PasswordController;
