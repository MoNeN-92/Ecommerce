export function SaleBadge({
  price,
  compareAtPrice,
  className = ""
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
}) {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }

  const percent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);

  return (
    <div className={`absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(220,38,38,0.32)] ${className}`}>
      <span>Sale</span>
      {percent > 0 ? <span className="rounded-full bg-white/18 px-2 py-1 text-[10px] tracking-[0.1em]">-{percent}%</span> : null}
    </div>
  );
}
