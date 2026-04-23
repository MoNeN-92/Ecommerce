import { z } from "zod";

const booleanish = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1" || normalized === "on") {
      return true;
    }

    if (normalized === "false" || normalized === "0" || normalized === "off" || normalized === "") {
      return false;
    }
  }

  return value;
}, z.boolean());

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
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  nameKa: z.string().min(2, "Name KA must be at least 2 characters"),
  nameEn: z.string().min(2, "Name EN must be at least 2 characters"),
  shortDescriptionKa: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  descriptionKa: z.string().min(10, "Description KA must be at least 10 characters"),
  descriptionEn: z.string().min(10, "Description EN must be at least 10 characters"),
  seoTitleKa: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoDescriptionKa: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  featured: booleanish.default(false),
  published: booleanish.default(true),
  topProduct: booleanish.default(false),
  installmentAvailable: booleanish.default(true),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1, "Add at least one image"),
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
  featured: booleanish.default(false)
});
