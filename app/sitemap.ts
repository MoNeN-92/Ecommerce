import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { SITE_URL, SUPPORTED_LOCALES } from "@/lib/site";

function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
    )
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: buildAlternates("")
    },
    {
      url: `${SITE_URL}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: buildAlternates("/products")
    },
    {
      url: `${SITE_URL}/${locale}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: buildAlternates("/about-us")
    },
    {
      url: `${SITE_URL}/${locale}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: buildAlternates("/faq")
    },
    {
      url: `${SITE_URL}/${locale}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: buildAlternates("/privacy-policy")
    },
    {
      url: `${SITE_URL}/${locale}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: buildAlternates("/terms-of-service")
    },
    {
      url: `${SITE_URL}/${locale}/delivery-returns-refunds`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: buildAlternates("/delivery-returns-refunds")
    }
  ]);

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        select: {
          slug: true,
          updatedAt: true,
          published: true
        }
      }),
      prisma.category.findMany({
        select: {
          slug: true,
          updatedAt: true
        }
      })
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap((category) =>
      SUPPORTED_LOCALES.map((locale) => ({
        url: `${SITE_URL}/${locale}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: buildAlternates(`/category/${category.slug}`)
      }))
    );

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((product) => product.published)
      .flatMap((product) =>
        SUPPORTED_LOCALES.map((locale) => ({
          url: `${SITE_URL}/${locale}/product/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          alternates: buildAlternates(`/product/${product.slug}`)
        }))
      );

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries", error);
    return staticRoutes;
  }
}
