import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true, published: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } })
  ]);

  const locales = ["ka", "en"];
  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date()
    },
    {
      url: `${SITE_URL}/${locale}/products`,
      lastModified: new Date()
    }
  ]);

  return [
    ...staticRoutes,
    ...products
      .filter((product) => product.published)
      .flatMap((product) =>
        locales.map((locale) => ({
          url: `${SITE_URL}/${locale}/product/${product.slug}`,
          lastModified: product.updatedAt
        }))
      ),
    ...categories.flatMap((category) =>
      locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/category/${category.slug}`,
        lastModified: category.updatedAt
      }))
    )
  ];
}
