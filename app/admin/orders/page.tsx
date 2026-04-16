import Link from "next/link";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getAdminMessages, normalizeAdminLocale, withAdminLang } from "@/lib/i18n/admin";

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, shippingAddress: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.orders.title}</h1>
          <p className="mt-2 text-slate-600">{messages.orders.description}</p>
        </div>
        <Link href={withAdminLang("/admin/orders/new", locale)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
          {messages.orders.createInvoice}
        </Link>
      </div>
      <Card>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">
                  {order.guestName || order.shippingAddress?.fullName} · {order.items.length} {messages.dashboard.items} · {Number(order.total).toFixed(2)} GEL
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={withAdminLang(`/admin/orders/${order.id}/invoice`, locale)} className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                  {messages.orders.openInvoice}
                </Link>
                <div className="w-[180px]">
                  <OrderStatusSelect orderId={order.id} value={order.status} locale={locale} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
