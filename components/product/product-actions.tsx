"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { InstallmentBankModal } from "@/components/product/installment-bank-modal";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductDetailItem } from "@/types";

export function ProductActions({ product, locale }: { product: ProductDetailItem; locale: "ka" | "en" }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const wishlist = useWishlistStore((state) => state.items);
  const toggle = useWishlistStore((state) => state.toggle);
  const pushRecent = useRecentlyViewedStore((state) => state.push);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const toggleWishlist = async () => {
    toggle(product.id);
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      });
    } catch {
      // Keep local wishlist working even if account sync is unavailable.
    }
  };

  const cartPayload = {
    productId: product.id,
    slug: product.slug,
    quantity: 1,
    name: product.name,
    image: product.image,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock
  };

  const beginCheckout = (method: "stripe" | "installment", bank?: string) => {
    addItem(cartPayload);
    const params = new URLSearchParams({ method });

    if (bank) {
      params.set("bank", bank);
    }

    router.push(`/${locale}/checkout?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button onClick={() => addItem(cartPayload)} className="w-full sm:w-auto">
        {locale === "ka" ? "კალათაში დამატება" : "Add to cart"}
      </Button>
      <Button variant="secondary" onClick={() => beginCheckout("stripe")} className="w-full sm:w-auto">
        {locale === "ka" ? "ონლაინ ყიდვა" : "Buy online"}
      </Button>
      <Button
        variant="secondary"
        onClick={() => setIsInstallmentModalOpen(true)}
        disabled={!product.installmentAvailable}
        className="w-full border-[#b98b52]/25 bg-[#fbf6ee] text-slate-950 hover:bg-[#f6eddf] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
        title={!product.installmentAvailable ? (locale === "ka" ? "ამ პროდუქტზე განვადება გამორთულია" : "Installments are disabled for this product") : undefined}
      >
        {locale === "ka" ? "ონლაინ განვადება" : "Online installments"}
      </Button>
      <Button variant="ghost" onClick={toggleWishlist} className="w-full gap-2 sm:w-auto">
        <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current text-red-500" : ""}`} />
        {locale === "ka" ? "სურვილებში" : "Wishlist"}
      </Button>
      <InstallmentBankModal
        locale={locale}
        open={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        onSelect={(bankId) => {
          setIsInstallmentModalOpen(false);
          beginCheckout("installment", bankId);
        }}
      />
    </div>
  );
}
