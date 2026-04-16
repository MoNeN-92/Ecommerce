"use client";

import Link from "next/link";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartSummary({ locale }: { locale: "ka" | "en" }) {
  const pricing = useCartStore((state) => state.pricing);

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-950">{locale === "ka" ? "შეჯამება" : "Summary"}</h2>
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(pricing.subtotal, getLocaleCurrency(locale))}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(pricing.shipping, getLocaleCurrency(locale))}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(pricing.discount, getLocaleCurrency(locale))}</span></div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-slate-950"><span>Total</span><span>{formatCurrency(pricing.total, getLocaleCurrency(locale))}</span></div>
      </div>
      <Link href={`/${locale}/checkout`} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
        {locale === "ka" ? "გადახდა" : "Checkout"}
      </Link>
    </div>
  );
}
