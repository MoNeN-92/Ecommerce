"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function HeaderActions({ locale }: { locale: "ka" | "en" }) {
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <div className="flex items-center gap-3">
      <Link href={`/${locale}/wishlist`} className="relative rounded-full border border-black/[0.07] bg-white/90 p-3 text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
        <Heart className="h-4 w-4" />
        {wishlistCount ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary-foreground)]">
            {wishlistCount}
          </span>
        ) : null}
      </Link>
      <Link href={`/${locale}/cart`} className="relative rounded-full border border-black/[0.07] bg-white/90 p-3 text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
        <ShoppingBag className="h-4 w-4" />
        {cartCount ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary-foreground)]">
            {cartCount}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
