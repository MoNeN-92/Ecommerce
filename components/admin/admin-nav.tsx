"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { AppRole } from "@/lib/auth/roles";
import { getAdminMessages, normalizeAdminLocale, withAdminLang } from "@/lib/i18n/admin";

export function AdminNav({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = normalizeAdminLocale(searchParams.get("lang"));
  const messages = getAdminMessages(locale);
  const navItems = [
    { href: "/admin", label: messages.nav.dashboard },
    { href: "/admin/products", label: messages.nav.products },
    { href: "/admin/categories", label: messages.nav.categories },
    { href: "/admin/orders", label: messages.nav.orders },
    ...(role === "SUPER_ADMIN" ? [{ href: "/admin/users", label: messages.nav.users }] : [])
  ];

  return (
    <aside className="admin-sidebar rounded-[2rem] border border-border bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border px-2 pb-4">
        <Link
          href={locale === "en" ? "/en" : "/ka"}
          className="rounded-full border border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
        >
          {messages.nav.storefront}
        </Link>
        <div className="flex items-center rounded-full border border-border bg-slate-50 p-1">
          <Link
            href={withAdminLang(pathname, "ka")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${locale === "ka" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
          >
            KA
          </Link>
          <Link
            href={withAdminLang(pathname, "en")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${locale === "en" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
          >
            EN
          </Link>
        </div>
      </div>
      <nav className="space-y-2 text-sm font-medium text-slate-700">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={withAdminLang(item.href, locale)}
              className={`block rounded-2xl px-4 py-3 transition ${isActive ? "bg-slate-950 text-white" : "hover:bg-slate-50"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
