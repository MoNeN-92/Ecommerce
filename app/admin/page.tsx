import { Card } from "@/components/ui/card";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";
import { getAdminAnalytics } from "@/lib/services/analytics";

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const analytics = await getAdminAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.dashboard.title}</h1>
        <p className="mt-2 text-slate-600">{messages.dashboard.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-500">{messages.dashboard.products}</p><p className="mt-2 text-3xl font-bold text-slate-950">{analytics.products}</p></Card>
        <Card><p className="text-sm text-slate-500">{messages.dashboard.orders}</p><p className="mt-2 text-3xl font-bold text-slate-950">{analytics.orders}</p></Card>
        <Card><p className="text-sm text-slate-500">{messages.dashboard.users}</p><p className="mt-2 text-3xl font-bold text-slate-950">{analytics.users}</p></Card>
        <Card><p className="text-sm text-slate-500">{messages.dashboard.sales}</p><p className="mt-2 text-3xl font-bold text-slate-950">{analytics.sales.toFixed(2)} GEL</p></Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">{messages.dashboard.recentOrders}</h2>
        <div className="mt-4 space-y-3">
          {analytics.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
              <div>
                <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.items.length} {messages.dashboard.items}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">{messages.status[order.status]}</p>
                <p className="font-semibold text-primary">{Number(order.total).toFixed(2)} GEL</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
