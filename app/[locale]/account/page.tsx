import { requireSession } from "@/lib/auth/session";
import { getUserDashboard } from "@/lib/services/account";

export default async function AccountPage() {
  const session = await requireSession();
  const data = await getUserDashboard(session.user.id);

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-8 shadow-soft">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">{data.user?.name}</h1>
        <p className="mt-2 text-sm text-slate-500">{data.user?.email}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.orders.length}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Addresses</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.addresses.length}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Wishlist</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.wishlist.length}</p>
        </div>
      </div>
    </div>
  );
}
