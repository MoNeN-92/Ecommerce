"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentlyViewedState = {
  items: string[];
  push: (slug: string) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      push: (slug) => {
        const next = [slug, ...get().items.filter((item) => item !== slug)].slice(0, 8);
        set({ items: next });
      }
    }),
    { name: "teq-recent" }
  )
);
