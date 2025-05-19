import crypto from "crypto";

const passwordGenerator = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
};

export default passwordGenerator;
