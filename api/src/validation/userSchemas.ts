import { z } from "zod";

export const userSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .trim(),
    password: z
      .string()
      .min(4, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
  }),
});

export const userParseSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .trim(),
  password: z
    .string()
    .min(4, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export type UserInput = z.infer<typeof userSchema>;
