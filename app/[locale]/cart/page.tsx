import type { Metadata } from "next";
import { CartList } from "@/components/cart/cart-list";
import { CartSummary } from "@/components/cart/cart-summary";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata("Cart");

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  return (
    <div className="container-shell grid gap-8 py-10 lg:grid-cols-[1.1fr_0.55fr]">
      <CartList locale={normalized} />
      <CartSummary locale={normalized} />
    </div>
  );
}
