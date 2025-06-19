import { NextFunction, Response } from "express";
import passwordGenerator from "../utils/passwordGenerator";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/types";
import { decryptPassword, encryptPassword } from "../utils/encryption";
import {
  deleteSitePasswordParseSchema,
  generatePasswordParseSchema,
  savePasswordParseSchema,
  siteParamParseSchema,
  siteParamSchema,
  updatePasswordBodySchema,
  updatePasswordIdSchema,
} from "../validation/passwordSchemas";

class PasswordController {
  static getSavedPasswords = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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
          id: _id,
        })
      );

      res.status(200).json(decryptedPasswords);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getSitePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { site: siteQuery } = siteParamParseSchema.parse(req.params);
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
      next(error);
    }
  };

  static generatePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { length } = generatePasswordParseSchema.parse(req.body);

      const password = passwordGenerator(length);

      res.status(201).json({ password });
    } catch (error) {
      next(error);
    }
  };

  static savePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { site, password } = savePasswordParseSchema.parse(req.body);
      const userId = req?.user?.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const encryptedPassword = encryptPassword(password);

      const newPasswordEntry = { site, password: encryptedPassword };
      user.savedPasswords.push(newPasswordEntry);
      await user.save();

      const savedPassword = user.savedPasswords[user.savedPasswords.length - 1];

      res.status(201).json({
        id: savedPassword._id,
        site: savedPassword.site,
        password,
      });
    } catch (err) {
      next(err);
    }
  };

  static updateSitePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = updatePasswordIdSchema.parse(req.params);
      const { password } = updatePasswordBodySchema.parse(req.body);

      const user = await User.findById(req?.user?.userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const passwordEntry = user.savedPasswords.id(id);
      if (!passwordEntry) {
        res.status(404).json({ error: "Password entry not found." });
        return;
      }

      const encryptedPassword = encryptPassword(password);
      passwordEntry.password = encryptedPassword;

      await user.save();

      res.status(200).json({
        site: passwordEntry.site,
        message: "Password updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteSitePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = deleteSitePasswordParseSchema.parse(req.params);
      const userId = req?.user?.userId;

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const entryToRemove = user.savedPasswords.id(id);

      if (!entryToRemove) {
        res.status(404).json({ error: "Password entry not found." });
        return;
      }
      user.savedPasswords.pull(id);
      await user.save();

      res.status(200).json({ message: `Password entry deleted.` });
    } catch (error) {
      next(error);
    }
  };
}

export default PasswordController;
