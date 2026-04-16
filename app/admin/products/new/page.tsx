import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db/prisma";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";

export default async function NewAdminProductPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.pages.newProduct}</h1>
      <ProductForm categories={categories} locale={locale} />
    </div>
  );
}
