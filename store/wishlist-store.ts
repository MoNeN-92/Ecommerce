"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[];
  toggle: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items.includes(productId)
          ? get().items.filter((id) => id !== productId)
          : [...get().items, productId];
        set({ items });
      }
    }),
    { name: "teq-wishlist" }
  )
);
