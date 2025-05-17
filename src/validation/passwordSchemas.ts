import { z } from "zod";

export const generatePasswordSchema = z.object({
  body: z.object({
    length: z.number().int().positive(),
    site: z.string().min(1),
  }),
});

export const generatePasswordParseSchema = z.object({
  length: z.number().int().positive(),
  site: z.string().min(1),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    length: z.number().int().positive(),
    site: z.string().min(1),
  }),
});

export const siteParamSchema = z.object({
  params: z.object({
    site: z.string().min(1),
  }),
});

export const deleteSitePasswordSchema = z.object({
  site: z.string().min(1, "Site param is required"),
});
