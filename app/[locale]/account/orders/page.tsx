import { requireSession } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/services/orders";

export default async function OrdersPage() {
  const session = await requireSession();
  const orders = await getOrdersForUser(session.user.id);

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="rounded-[1.5rem] border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{order.orderNumber}</p>
              <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right text-sm">
              <p>{order.status}</p>
              <p className="font-semibold text-primary">{Number(order.total).toFixed(2)} GEL</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
