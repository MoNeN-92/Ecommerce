import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";
import { getAdminMessages, normalizeAdminLocale, withAdminLang } from "@/lib/i18n/admin";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.products.title}</h1>
          <p className="mt-2 text-slate-600">{messages.products.description}</p>
        </div>
        <Link href={withAdminLang("/admin/products/new", locale)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
          {messages.products.add}
        </Link>
      </div>
      <Card>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
              <div>
                <p className="font-semibold text-slate-950">{locale === "en" ? product.nameEn : product.nameKa}</p>
                <p className="text-sm text-slate-500">
                  {locale === "en" ? product.category.nameEn : product.category.nameKa} · {product.brand} · {product.stock} {messages.products.inStock}
                </p>
                <p className="mt-1 text-xs text-slate-400">{product.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary">{Number(product.price).toFixed(2)} GEL</span>
                <Link href={withAdminLang(`/admin/products/${product.id}`, locale)} className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                  {messages.products.edit}
                </Link>
                <AdminDeleteButton
                  endpoint={`/api/admin/products/${product.id}`}
                  confirmMessage={messages.products.deleteConfirm}
                  label={messages.products.delete}
                  deletingLabel={messages.products.deleting}
                  fallbackError={messages.products.deleteFailed}
                  className="px-4 py-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
