import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";

export default async function SearchPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const { q = '' } = await searchParams;
  const products = await listProducts(normalized, { q });

  return (
    <div className="container-shell space-y-8 py-10">
      <SectionHeading eyebrow="Search" title={`“${q}”`} description={`${products.total} results`} />
      <ProductGrid products={products.items} locale={normalized} />
    </div>
  );
}
