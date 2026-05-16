import Link from "next/link";
import type { Session } from "next-auth";
import { getMessages } from "@/lib/i18n/messages";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchBox } from "@/components/layout/search-box";
import { HeaderActions } from "@/components/layout/header-actions";
import { AuthLink } from "@/components/layout/auth-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SiteLogo } from "@/components/shared/site-logo";
import { getSessionRole, isAdminLike } from "@/lib/auth/roles";

export function Header({ locale, session }: { locale: "ka" | "en"; session: Session | null }) {
  const t = getMessages(locale);
  const canAccessAdmin = isAdminLike(getSessionRole(session));

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-[rgba(246,242,235,0.82)] backdrop-blur-xl">
      <div className="container-shell py-3 lg:py-4">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="flex min-w-0 shrink items-center">
            <SiteLogo priority className="h-11 w-auto rounded-xl border border-black/[0.08] object-cover shadow-[0_14px_34px_rgba(17,24,39,0.14)] sm:h-12" />
          </Link>

          <nav className="hidden items-center gap-6 pl-4 text-sm font-medium text-slate-600 lg:flex">
            <Link href={`/${locale}/products`} className="transition hover:text-slate-950">{t.nav.products}</Link>
            <Link href={`/${locale}/products?featured=true`} className="transition hover:text-slate-950">{t.nav.deals}</Link>
            <Link href={`/${locale}/account`} className="transition hover:text-slate-950">{t.nav.account}</Link>
            {canAccessAdmin ? <Link href="/admin" className="transition hover:text-slate-950">{t.nav.admin}</Link> : null}
          </nav>

          <SearchBox locale={locale} className="ml-2 hidden flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <LanguageSwitcher locale={locale} />
              <AuthLink locale={locale} session={session} />
            </div>
            <HeaderActions locale={locale} />
            <MobileMenu locale={locale} session={session} />
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <SearchBox locale={locale} className="max-w-none" />
        </div>
      </div>
    </header>
  );
}
