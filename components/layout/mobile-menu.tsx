"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { AuthLink } from "@/components/layout/auth-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getMessages } from "@/lib/i18n/messages";

export function MobileMenu({ locale, session }: { locale: "ka" | "en"; session: Session | null }) {
  const t = getMessages(locale);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.07] bg-white/90 text-slate-700 transition hover:border-slate-300 hover:text-slate-950 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-x-3 top-3 rounded-[2rem] border border-black/[0.06] bg-[#fcfaf6] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
              <div>
                <p className="font-display text-base font-semibold tracking-[0.12em] text-slate-950">TechStore</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Georgia</p>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-4 grid gap-2">
              <Link href={`/${locale}/products`} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-white">
                {t.nav.products}
              </Link>
              <Link href={`/${locale}/products?featured=true`} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-white">
                {t.nav.deals}
              </Link>
              <Link href={`/${locale}/account`} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-white">
                {t.nav.account}
              </Link>
              {session?.user.role === "ADMIN" ? (
                <Link href="/admin" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-white">
                  {t.nav.admin}
                </Link>
              ) : null}
            </nav>

            <div className="mt-4 grid gap-3 border-t border-black/[0.06] pt-4">
              <LanguageSwitcher locale={locale} />
              <AuthLink locale={locale} session={session} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
