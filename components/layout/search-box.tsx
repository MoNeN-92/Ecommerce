"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { cn, formatCurrency, getLocaleCurrency } from "@/lib/utils";

export function SearchBox({ locale }: { locale: "ka" | "en" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ id: string; slug: string; name: string; image: string; price: number; brand: string }>
  >([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}&locale=${locale}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setResults(data);
        setOpen(true);
      })();
    });

    return () => controller.abort();
  }, [deferredQuery, locale]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/90 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={locale === "ka" ? "მოძებნე პროდუქტები" : "Search products"}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")}>
            <X className="h-4 w-4 text-slate-400" />
          </button>
        ) : null}
      </div>
      {open && (results.length > 0 || isPending) ? (
        <div className="absolute inset-x-0 top-full z-20 mt-3 rounded-[1.75rem] border border-black/[0.06] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.09)]">
          {isPending ? <p className="px-2 py-3 text-sm text-slate-500">Loading...</p> : null}
          <div className="space-y-2">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/product/${item.slug}`}
                onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-50")}
              >
                <Image src={item.image} alt={item.name} width={56} height={56} className="rounded-2xl border border-black/[0.06]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.brand}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatCurrency(item.price, getLocaleCurrency(locale))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
