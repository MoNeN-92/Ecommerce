import { z } from "zod";

export const manualInvoiceSchema = z.object({
  locale: z.enum(["ka", "en"]).default("ka"),
  customerName: z.string().min(2),
  customerPhone: z.string().min(5).optional().or(z.literal("")),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  paymentProvider: z.enum(["cash", "bank_transfer"]).default("cash"),
  paymentStatus: z.enum(["PAID", "PENDING"]).default("PAID"),
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.coerce.number().int().min(1)
      })
    )
    .min(1)
});

export type ManualInvoiceInput = z.infer<typeof manualInvoiceSchema>;
