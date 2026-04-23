import { notFound } from "next/navigation";
import { PrintInvoiceButton } from "@/components/admin/print-invoice-button";
import { Card } from "@/components/ui/card";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";
import { getAdminOrderById } from "@/lib/services/orders";
import {
  COMPANY_IDENTIFIER,
  COMPANY_NAME,
  SITE_ADDRESS_EN,
  SITE_ADDRESS_KA,
  SITE_EMAIL,
  SITE_PHONE_DISPLAY
} from "@/lib/site";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";

function paymentLabel(value: string, locale: "ka" | "en") {
  if (value === "bank_transfer") {
    return locale === "ka" ? "ბანკით გადარიცხვა" : "Bank transfer";
  }

  return locale === "ka" ? "ნაღდი" : "Cash";
}

export default async function AdminInvoicePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="invoice-page space-y-6">
      <div className="invoice-actions flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.orders.invoiceDocument}</h1>
          <p className="mt-2 text-slate-600">
            {messages.orders.orderNumber}: {order.orderNumber}
          </p>
        </div>
        <PrintInvoiceButton label={messages.orders.print} />
      </div>

      <Card className="invoice-document space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">JOKER STORE</p>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>{COMPANY_NAME}</p>
              <p>
                {locale === "ka" ? "საიდენტიფიკაციო კოდი" : "Identification code"}: {COMPANY_IDENTIFIER}
              </p>
              <p>{locale === "ka" ? SITE_ADDRESS_KA : SITE_ADDRESS_EN}</p>
              <p>{SITE_EMAIL}</p>
              <p>{SITE_PHONE_DISPLAY}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600 md:text-right">
            <p>
              {messages.orders.orderDate}: {new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-US").format(order.createdAt)}
            </p>
            <p>
              {messages.orders.paymentProviderLabel}: {paymentLabel(order.paymentProvider, locale)}
            </p>
            <p>
              {messages.orders.paymentStatusLabel}: {order.paymentStatus === "PAID" ? messages.orders.paid : messages.orders.pending}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-950">{messages.orders.billedTo}</p>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{order.guestName || order.shippingAddress?.fullName || "-"}</p>
            {order.guestPhone ? <p>{order.guestPhone}</p> : null}
            {order.guestEmail ? <p>{order.guestEmail}</p> : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-border">
          <div className="grid grid-cols-[1.8fr_120px_140px_160px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{messages.orders.product}</span>
            <span>SKU</span>
            <span>{messages.orders.quantity}</span>
            <span>{messages.orders.total}</span>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1.8fr_120px_140px_160px] gap-3 px-4 py-4 text-sm text-slate-700">
                <span>{locale === "ka" ? item.nameKa : item.nameEn}</span>
                <span>{item.sku}</span>
                <span>{item.quantity}</span>
                <span>{formatCurrency(Number(item.unitPrice) * item.quantity, getLocaleCurrency(locale))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ml-auto max-w-sm space-y-3 rounded-[1.5rem] border border-border bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{messages.orders.subtotal}</span>
            <span>{formatCurrency(order.subtotal.toNumber(), getLocaleCurrency(locale))}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Discount</span>
            <span>{formatCurrency(order.discount.toNumber(), getLocaleCurrency(locale))}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-slate-950">
            <span>{messages.orders.total}</span>
            <span>{formatCurrency(order.total.toNumber(), getLocaleCurrency(locale))}</span>
          </div>
        </div>

        {order.notes ? (
          <div>
            <p className="text-sm font-semibold text-slate-950">{messages.orders.notes}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{order.notes}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
