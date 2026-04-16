import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RemoteImage } from "@/components/ui/remote-image";
import type { ProductCardItem } from "@/types";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";

export function ProductCard({ product, locale }: { product: ProductCardItem; locale: "ka" | "en" }) {
  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group block rounded-[2rem] border border-black/[0.06] bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.09)]"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f5f1ea]">
        <div className="absolute inset-x-10 top-4 h-20 rounded-full bg-[#b98b52]/12 blur-3xl" />
        <RemoteImage
          src={product.image}
          alt={product.name}
          width={520}
          height={520}
          sizes="(max-width: 768px) 100vw, 25vw"
          className="relative aspect-square h-auto w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge>{product.brand}</Badge>
        {product.compareAtPrice ? <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b98b52]">Sale</span> : null}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-slate-950">{formatCurrency(product.price, getLocaleCurrency(locale))}</p>
          {product.compareAtPrice ? (
            <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice, getLocaleCurrency(locale))}</p>
          ) : null}
        </div>
        <span className="rounded-full border border-black/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
          {product.stock > 0 ? "In stock" : "Out"}
        </span>
      </div>
    </Link>
  );
}
