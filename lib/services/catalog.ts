import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/i18n/config";
import { productQuerySchema } from "@/lib/validators/catalog";
import type { ProductCardItem, ProductDetailItem } from "@/types";

function localizeText(locale: Locale, ka: string, en: string) {
  return locale === "ka" ? ka : en;
}

function serializePrice(value: Prisma.Decimal | null | undefined) {
  return value ? Number(value) : null;
}

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

function mapProductCard(product: ProductWithCategory, locale: Locale): ProductCardItem {
  return {
    id: product.id,
    slug: product.slug,
    name: localizeText(locale, product.nameKa, product.nameEn),
    shortDescription: localizeText(
      locale,
      product.shortDescriptionKa ?? "",
      product.shortDescriptionEn ?? ""
    ),
    brand: product.brand,
    image: product.images[0] ?? "https://placehold.co/800x800?text=Product",
    price: Number(product.price),
    compareAtPrice: serializePrice(product.compareAtPrice),
    stock: product.stock,
    categoryName: localizeText(locale, product.category.nameKa, product.category.nameEn),
    categorySlug: product.category.slug,
    featured: product.featured,
    topProduct: product.topProduct,
    installmentAvailable: product.installmentAvailable
  };
}

export const getCategories = unstable_cache(
  async (locale: Locale) => {
    const categories = await prisma.category.findMany({
      orderBy: { nameKa: "asc" }
    });

    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: localizeText(locale, category.nameKa, category.nameEn),
      description: localizeText(locale, category.descriptionKa ?? "", category.descriptionEn ?? ""),
      image: category.image ?? "https://placehold.co/800x600?text=Category",
      featured: category.featured
    }));
  },
  ["categories"],
  { revalidate: 300 }
);

export async function listProducts(locale: Locale, query: Record<string, string | string[] | undefined>) {
  const filters = productQuerySchema.parse(query);
  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.brand ? { brand: filters.brand } : {}),
    ...(filters.featured ? { featured: true } : {}),
    ...(filters.inStock ? { stock: { gt: 0 } } : {}),
    ...(filters.q
      ? {
          OR: [
            { nameKa: { contains: filters.q, mode: "insensitive" } },
            { nameEn: { contains: filters.q, mode: "insensitive" } },
            { brand: { contains: filters.q, mode: "insensitive" } },
            { sku: { contains: filters.q, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {})
          }
        }
      : {})
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = { createdAt: "desc" };

  if (filters.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (filters.sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (filters.sort === "popularity") {
    orderBy = [{ featured: "desc" }, { reviewCount: "desc" }, { createdAt: "desc" }];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        category: true
      }
    }),
    prisma.product.count({ where })
  ]);

  return {
    items: products.map((product) => mapProductCard(product, locale)),
    total,
    page: filters.page,
    pageSize: filters.pageSize
  };
}

export const getFeaturedContent = unstable_cache(
  async (locale: Locale) => {
    const [featuredProducts, trendingProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true, published: true },
        take: 4,
        orderBy: [{ topProduct: "desc" }, { updatedAt: "desc" }],
        include: { category: true }
      }),
      prisma.product.findMany({
        where: { published: true },
        take: 8,
        orderBy: [{ topProduct: "desc" }, { reviewCount: "desc" }, { createdAt: "desc" }],
        include: { category: true }
      }),
      prisma.category.findMany({
        where: { featured: true },
        take: 4
      })
    ]);

    return {
      featuredProducts: featuredProducts.map((product) => mapProductCard(product, locale)),
      trendingProducts: trendingProducts.map((product) => mapProductCard(product, locale)),
      categories: categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: localizeText(locale, category.nameKa, category.nameEn),
        description: localizeText(locale, category.descriptionKa ?? "", category.descriptionEn ?? ""),
        image: category.image ?? "https://placehold.co/800x600?text=Category"
      }))
    };
  },
  ["featured-content"],
  { revalidate: 300 }
);

export async function getProductBySlug(locale: Locale, slug: string): Promise<ProductDetailItem | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true
    }
  });

  if (!product || !product.published) {
    return null;
  }

  return {
    ...mapProductCard(product, locale),
    description: localizeText(locale, product.descriptionKa, product.descriptionEn),
    specs: (product.specs as Record<string, string>) ?? {},
    images: product.images,
    metaTitle: localizeText(locale, product.seoTitleKa ?? "", product.seoTitleEn ?? ""),
    metaDescription: localizeText(
      locale,
      product.seoDescriptionKa ?? "",
      product.seoDescriptionEn ?? ""
    ),
    ratingAverage: product.ratingAverage,
    reviewCount: product.reviewCount,
    keywords: product.metaKeywords
  };
}

export async function getRelatedProducts(locale: Locale, slug: string, categorySlug: string) {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      slug: { not: slug },
      category: { slug: categorySlug }
    },
    take: 4,
    include: {
      category: true
    }
  });

  return products.map((product) => mapProductCard(product, locale));
}

export async function searchProducts(locale: Locale, term: string) {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { nameKa: { contains: term, mode: "insensitive" } },
        { nameEn: { contains: term, mode: "insensitive" } },
        { brand: { contains: term, mode: "insensitive" } }
      ]
    },
    include: {
      category: true
    },
    take: 6
  });

  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: localizeText(locale, product.nameKa, product.nameEn),
    image: product.images[0] ?? "https://placehold.co/300x300?text=Product",
    price: Number(product.price),
    brand: product.brand
  }));
}

export async function getBrands() {
  const rows = await prisma.product.findMany({
    distinct: ["brand"],
    select: {
      brand: true
    },
    orderBy: {
      brand: "asc"
    }
  });

  return rows.map((row) => row.brand);
}
