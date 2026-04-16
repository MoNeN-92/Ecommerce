import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AddressesPage() {
  const session = await requireSession();
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">Addresses</h1>
      {addresses.map((address) => (
        <div key={address.id} className="rounded-[1.5rem] border border-border p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{address.fullName}</p>
              <p className="text-sm text-slate-500">{address.street}, {address.city}</p>
              <p className="text-sm text-slate-500">{address.phone}</p>
            </div>
            {address.isDefault ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-primary">Default</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
