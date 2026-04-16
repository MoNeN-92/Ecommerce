"use client";

import { useWishlistStore } from "@/store/wishlist-store";

export function WishlistState() {
  const items = useWishlistStore((state) => state.items);
  return <span>{items.length}</span>;
}
