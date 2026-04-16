import { z } from "zod";
import { addressSchema } from "@/lib/validators/checkout";

export const profileSchema = z.object({
  name: z.string().min(2).max(60),
  phone: z.string().min(6).max(32).optional(),
  locale: z.enum(["ka", "en"]).default("ka")
});

export const addressUpsertSchema = addressSchema.extend({
  isDefault: z.boolean().default(false)
});
