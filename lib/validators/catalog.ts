import { z } from "zod";

const nullableText = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}, z.string().optional().nullable());

export const productQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  q: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  featured: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
  sort: z.enum(["newest", "price-asc", "price-desc", "popularity"]).default("newest"),
  inStock: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(48).default(12)
});

export const productSchema = z.object({
  slug: z.string().min(3),
  sku: z.string().min(3),
  nameKa: z.string().min(2),
  nameEn: z.string().min(2),
  shortDescriptionKa: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  descriptionKa: z.string().min(10),
  descriptionEn: z.string().min(10),
  seoTitleKa: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoDescriptionKa: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  brand: z.string().min(2),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  topProduct: z.boolean().default(false),
  installmentAvailable: z.boolean().default(true),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1),
  metaKeywords: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string())
});

export const categorySchema = z.object({
  slug: z.string().trim().min(2),
  nameKa: z.string().trim().min(2),
  nameEn: z.string().trim().min(2),
  descriptionKa: nullableText,
  descriptionEn: nullableText,
  image: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }, z.string().url().optional().nullable()),
  featured: z.boolean().default(false)
});
