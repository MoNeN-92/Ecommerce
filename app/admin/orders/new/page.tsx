import { ManualInvoiceForm } from "@/components/admin/manual-invoice-form";
import { prisma } from "@/lib/db/prisma";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";

export default async function NewAdminInvoicePage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const products = await prisma.product.findMany({
    orderBy: { nameEn: "asc" },
    select: {
      id: true,
      nameKa: true,
      nameEn: true,
      sku: true,
      stock: true,
      price: true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.orders.invoiceTitle}</h1>
        <p className="mt-2 text-slate-600">{messages.orders.invoiceDescription}</p>
      </div>
      <ManualInvoiceForm
        locale={locale}
        products={products.map((product) => ({
          ...product,
          price: Number(product.price)
        }))}
      />
    </div>
  );
}
