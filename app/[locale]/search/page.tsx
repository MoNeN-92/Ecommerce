import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { listProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const { q = "" } = await searchParams;

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? `ძებნა: ${q}` : `Search: ${q}`,
    description:
      normalized === "ka"
        ? "საიტის შიდა ძიების შედეგები."
        : "Internal site search results.",
    path: `/${normalized}/search`,
    noIndex: true
  });
}

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
