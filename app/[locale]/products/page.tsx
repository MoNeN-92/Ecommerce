import type { Metadata } from "next";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBrands, getCategories, listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const queries = await searchParams;
  const hasFilters = Object.entries(queries).some(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  });

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? "ყველა პროდუქტი" : "All Products",
    description:
      normalized === "ka"
        ? "იხილეთ ელექტრონიკის, აუდიოსა და აქსესუარების სრული კატალოგი ფასით, ბრენდით და კატეგორიით."
        : "Browse the full catalog of electronics, audio, and accessories by price, brand, and category.",
    path: `/${normalized}/products`,
    keywords:
      normalized === "ka"
        ? ["ყველა პროდუქტი", "ტექნიკის კატალოგი", "ელექტრონიკა", "ფასები"]
        : ["all products", "electronics catalog", "gadgets", "prices"],
    noIndex: hasFilters
  });
}

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const queries = await searchParams;
  const [products, brands, categories] = await Promise.all([
    listProducts(normalized, queries),
    getBrands(),
    getCategories(normalized)
  ]);

  return (
    <div className="container-shell space-y-8 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: normalized === "ka" ? "ყველა პროდუქტი" : "All products",
            description: `${products.total} items`,
            url: `${SITE_URL}/${normalized}/products`,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: normalized === "ka" ? "მთავარი" : "Home",
                item: `${SITE_URL}/${normalized}`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: normalized === "ka" ? "პროდუქტები" : "Products",
                item: `${SITE_URL}/${normalized}/products`
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.items.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/${normalized}/product/${product.slug}`,
              name: product.name
            }))
          }
        ]}
      />
      <SectionHeading eyebrow="Catalog" title={normalized === "ka" ? "ყველა პროდუქტი" : "All products"} description={`${products.total} items`} />
      <ProductFilters locale={normalized} brands={brands} categories={categories.map((category) => ({ slug: category.slug, name: category.name }))} />
      <ProductGrid products={products.items} locale={normalized} />
    </div>
  );
}
