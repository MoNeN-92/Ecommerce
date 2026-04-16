import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const normalized = normalizeLocale(locale);
  const categories = await getCategories(normalized);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {};
  }

  return buildPageMetadata({
    locale: normalized,
    title: category.name,
    description:
      category.description ||
      (normalized === "ka"
        ? `${category.name} კატეგორიის ტექნიკა და აქსესუარები.`
        : `${category.name} category products and accessories.`),
    path: `/${normalized}/category/${slug}`,
    keywords: [category.name, normalized === "ka" ? "კატეგორია" : "category"]
  });
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const normalized = normalizeLocale(locale);
  const [categories, products] = await Promise.all([
    getCategories(normalized),
    listProducts(normalized, { category: slug })
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container-shell space-y-8 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description,
            url: `${SITE_URL}/${normalized}/category/${category.slug}`,
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
              },
              {
                "@type": "ListItem",
                position: 3,
                name: category.name,
                item: `${SITE_URL}/${normalized}/category/${category.slug}`
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
      <SectionHeading eyebrow="Category" title={category.name} description={category.description} />
      <ProductGrid products={products.items} locale={normalized} />
    </div>
  );
}
