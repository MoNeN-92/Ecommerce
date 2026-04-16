"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ProductFilters({
  locale,
  brands,
  categories
}: {
  locale: "ka" | "en";
  brands: string[];
  categories: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeSearch = searchParams ?? new URLSearchParams();
  const [minPrice, setMinPrice] = useState(safeSearch.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(safeSearch.get("maxPrice") ?? "");
  const [brand, setBrand] = useState(safeSearch.get("brand") ?? "");
  const [category, setCategory] = useState(safeSearch.get("category") ?? "");
  const [sort, setSort] = useState(safeSearch.get("sort") ?? "newest");
  const [inStock, setInStock] = useState(safeSearch.get("inStock") ?? "false");

  const apply = () => {
    const params = new URLSearchParams(safeSearch.toString());
    [
      ["minPrice", minPrice],
      ["maxPrice", maxPrice],
      ["brand", brand],
      ["category", category],
      ["sort", sort]
    ].forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (inStock === "true") params.set("inStock", "true");
    else params.delete("inStock");

    router.push(`/${locale}/products?${params.toString()}`);
  };

  return (
    <div className="rounded-[2rem] border border-border bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min" />
        <Input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" />
        <Select value={brand} onChange={(event) => setBrand(event.target.value)}>
          <option value="">All brands</option>
          {brands.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price asc</option>
          <option value="price-desc">Price desc</option>
          <option value="popularity">Popularity</option>
        </Select>
        <Select value={inStock} onChange={(event) => setInStock(event.target.value)}>
          <option value="false">All stock</option>
          <option value="true">In stock only</option>
        </Select>
      </div>
      <Button onClick={apply} className="mt-4">Apply filters</Button>
    </div>
  );
}
