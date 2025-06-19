import { z } from "zod";

export const generatePasswordSchema = z.object({
  body: z.object({
    length: z.number().int().positive(),
    site: z.string().min(1),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    site: z.string().min(1),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const siteParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const siteParamParseSchema = z.object({
  site: z.string().min(6),
});

export const savePasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8),
    site: z.string().min(1),
  }),
});

export const deleteSitePasswordParseSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const generatePasswordParseSchema = z.object({
  length: z.number().int().positive(),
});

export const updatePasswordIdSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const updatePasswordBodySchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const savePasswordParseSchema = z.object({
  password: z.string().min(8),
  site: z.string().min(1),
});
