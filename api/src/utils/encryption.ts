import crypto from "crypto";

const SECRET_KEY = process.env.ENCRYPTION_SECRET!;
const IV_LENGTH = 16;

export const encryptPassword = (password: string): string => {
  const key = Buffer.from(SECRET_KEY as string, "hex");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decryptPassword = (encryptedText: string): string => {
  const key = Buffer.from(SECRET_KEY as string, "hex");
  const [iv, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
