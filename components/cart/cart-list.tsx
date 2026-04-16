"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartList({ locale }: { locale: "ka" | "en" }) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (!items.length) {
    return <p className="rounded-[2rem] border border-dashed border-border bg-white p-10 text-center text-slate-500">{locale === "ka" ? "კალათა ცარიელია" : "Your cart is empty"}</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.productId} className="flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-4 shadow-soft md:flex-row md:items-center">
          <Image src={item.image} alt={item.name} width={120} height={120} className="rounded-[1.5rem]" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-slate-950">{item.name}</p>
            <p className="text-sm text-slate-500">SKU: {item.slug}</p>
            <p className="mt-2 text-sm font-semibold text-primary">{formatCurrency(item.price, getLocaleCurrency(locale))}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
              className="w-20 rounded-2xl border border-border px-3 py-2"
            />
            <Button variant="ghost" onClick={() => removeItem(item.productId)}>{locale === "ka" ? "წაშლა" : "Remove"}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
