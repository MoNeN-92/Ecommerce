import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(6).max(32).optional(),
  locale: z.enum(["ka", "en"]).default("ka")
});
