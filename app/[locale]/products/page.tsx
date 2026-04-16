import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBrands, getCategories, listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";

export const revalidate = 300;

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
      <SectionHeading eyebrow="Catalog" title={normalized === "ka" ? "ყველა პროდუქტი" : "All products"} description={`${products.total} items`} />
      <ProductFilters locale={normalized} brands={brands} categories={categories.map((category) => ({ slug: category.slug, name: category.name }))} />
      <ProductGrid products={products.items} locale={normalized} />
    </div>
  );
}
