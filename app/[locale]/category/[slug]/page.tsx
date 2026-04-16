import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";

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
      <SectionHeading eyebrow="Category" title={category.name} description={category.description} />
      <ProductGrid products={products.items} locale={normalized} />
    </div>
  );
}
