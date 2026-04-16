import Link from "next/link";
import { Cpu } from "lucide-react";
import type { Session } from "next-auth";
import { getMessages } from "@/lib/i18n/messages";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchBox } from "@/components/layout/search-box";
import { HeaderActions } from "@/components/layout/header-actions";
import { AuthLink } from "@/components/layout/auth-link";

export function Header({ locale, session }: { locale: "ka" | "en"; session: Session | null }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-[rgba(246,242,235,0.82)] backdrop-blur-xl">
      <div className="container-shell flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-[var(--primary-foreground)] shadow-[0_14px_34px_rgba(17,24,39,0.14)]">
            <Cpu className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold tracking-[0.12em] text-slate-950">TechStore</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Georgia</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 pl-4 text-sm font-medium text-slate-600 lg:flex">
          <Link href={`/${locale}/products`} className="transition hover:text-slate-950">{t.nav.products}</Link>
          <Link href={`/${locale}/products?featured=true`} className="transition hover:text-slate-950">{t.nav.deals}</Link>
          <Link href={`/${locale}/account`} className="transition hover:text-slate-950">{t.nav.account}</Link>
          {session?.user.role === "ADMIN" ? <Link href="/admin" className="transition hover:text-slate-950">{t.nav.admin}</Link> : null}
        </nav>
        <SearchBox locale={locale} />
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher locale={locale} />
            <AuthLink locale={locale} session={session} />
          </div>
          <HeaderActions locale={locale} />
        </div>
      </div>
    </header>
  );
}
