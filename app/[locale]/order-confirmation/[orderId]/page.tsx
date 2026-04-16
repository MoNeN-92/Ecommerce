import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { normalizeLocale } from "@/lib/i18n/config";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
  const { locale, orderId } = await params;
  const normalized = normalizeLocale(locale);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, shippingAddress: true }
  });

  if (!order) {
    return <div className="container-shell py-16">Order not found.</div>;
  }

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-border bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Order confirmed</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950">{order.orderNumber}</h1>
        <p className="mt-4 text-slate-600">{normalized === 'ka' ? 'თქვენი შეკვეთა მიღებულია და დამუშავდება მოკლე დროში.' : 'Your order has been received and will be processed shortly.'}</p>
        <div className="mt-8 space-y-2 text-sm text-slate-600">
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Total: {Number(order.total).toFixed(2)} GEL</p>
        </div>
        <Link href={`/${normalized}/products`} className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Continue shopping</Link>
      </div>
    </div>
  );
}
