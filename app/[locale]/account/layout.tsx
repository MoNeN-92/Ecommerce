import type { ReactNode } from "react";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { normalizeLocale } from "@/lib/i18n/config";

export default async function AccountLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  await requireSession();

  return (
    <div className="container-shell grid gap-8 py-10 lg:grid-cols-[0.28fr_0.72fr]">
      <aside className="rounded-[2rem] border border-border bg-white p-4 shadow-soft">
        <nav className="space-y-2 text-sm font-medium text-slate-700">
          <Link href={`/${normalized}/account`} className="block rounded-2xl px-4 py-3 hover:bg-slate-50">Profile</Link>
          <Link href={`/${normalized}/account/orders`} className="block rounded-2xl px-4 py-3 hover:bg-slate-50">Orders</Link>
          <Link href={`/${normalized}/account/addresses`} className="block rounded-2xl px-4 py-3 hover:bg-slate-50">Addresses</Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
