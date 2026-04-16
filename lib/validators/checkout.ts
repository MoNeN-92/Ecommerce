import { z } from "zod";

export const cartLineSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(20)
});

export const cartSyncSchema = z.object({
  items: z.array(cartLineSchema).max(50)
});

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2).max(90),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(6).max(32),
  country: z.string().default("Georgia"),
  city: z.string().min(2),
  state: z.string().optional(),
  street: z.string().min(4),
  postalCode: z.string().optional()
});

export const checkoutSchema = z.object({
  locale: z.enum(["ka", "en"]).default("ka"),
  items: z.array(cartLineSchema).min(1),
  paymentProvider: z.enum(["stripe", "cash", "installment"]).default("stripe"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  installmentBank: z.string().max(80).optional(),
  installmentMonths: z.coerce.number().int().min(3).max(36).optional(),
  guest: z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(6).max(32)
    })
    .optional(),
  notes: z.string().max(1000).optional()
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional()
});
