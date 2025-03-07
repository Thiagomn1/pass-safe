import { Request, Response } from "express";
import passwordGenerator from "../utils/passwordGenerator";

class PasswordController {
  static generatePassword = async (req: Request, res: Response) => {
    try {
      const length = parseInt(req.query.length as string, 10);

      if (isNaN(length) || length <= 0) {
        res.status(400).json({
          error: "Invalid length. Please provide a positive integer.",
        });
      }

      const password = passwordGenerator(length);
      res.status(200).json({ generated_password: password });
    } catch (err: unknown) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default PasswordController;
