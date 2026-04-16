import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getAuthSession } from "@/lib/auth/session";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildBaseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildBaseMetadata(normalizeLocale(locale));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  if (normalized !== locale) {
    notFound();
  }

  const session = await getAuthSession();

  return (
    <div className="min-h-screen">
      <Header locale={normalized} session={session} />
      <main>{children}</main>
      <Footer locale={normalized} />
    </div>
  );
}
