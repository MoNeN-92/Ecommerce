"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLineItem } from "@/types";

type CartState = {
  items: CartLineItem[];
  pricing: { subtotal: number; shipping: number; discount: number; total: number; count: number };
  addItem: (item: CartLineItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  sync: () => Promise<void>;
};

const initialPricing = { subtotal: 0, shipping: 0, discount: 0, total: 0, count: 0 };

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pricing: initialPricing,
      addItem: (item) => {
        const existing = get().items.find((entry) => entry.productId === item.productId);
        const items = existing
          ? get().items.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, entry.stock) }
                : entry
            )
          : [...get().items, item];
        set({ items });
        void get().sync();
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items
          .map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry))
          .filter((entry) => entry.quantity > 0);
        set({ items });
        void get().sync();
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((entry) => entry.productId !== productId) });
        void get().sync();
      },
      clear: () => set({ items: [], pricing: initialPricing }),
      sync: async () => {
        const payload = { items: get().items.map((item) => ({ productId: item.productId, quantity: item.quantity })) };
        if (!payload.items.length) {
          set({ pricing: initialPricing });
          return;
        }
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) return;
        const data = await response.json();
        set({
          items: data.items.map((item: CartLineItem) => {
            const existing = get().items.find((entry) => entry.productId === item.productId);
            return { ...item, quantity: existing?.quantity ?? item.quantity };
          }),
          pricing: data.pricing
        });
      }
    }),
    {
      name: "teq-cart"
    }
  )
);
