import type { Order, Product } from "@prisma/client";

export type LocalizedEntity = {
  name: string;
  description?: string | null;
};

export type ProductCardItem = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription?: string | null;
  brand: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  categoryName: string;
  categorySlug: string;
  featured: boolean;
  topProduct: boolean;
  installmentAvailable: boolean;
  isDemo?: boolean;
  sourceNote?: string | null;
};

export type ProductDetailItem = ProductCardItem & {
  description: string;
  specs: Record<string, string>;
  images: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  ratingAverage: number;
  reviewCount: number;
  keywords: string[];
};

export type CartLineItem = {
  productId: string;
  slug: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
};

export type CartPricing = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  count: number;
};

export type CheckoutResult = {
  order: Order;
  paymentUrl?: string | null;
};
