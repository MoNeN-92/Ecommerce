import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db/prisma";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";

export default async function EditAdminProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.product.findUnique({ where: { id } })
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.pages.editProduct}</h1>
      <ProductForm categories={categories} product={product} locale={locale} />
    </div>
  );
}
