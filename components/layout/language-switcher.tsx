"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale }: { locale: "ka" | "en" }) {
  const pathname = usePathname() ?? `/${locale}`;
  const target = pathname.replace(/^\/(ka|en)/, locale === "ka" ? "/en" : "/ka");

  return (
    <Link
      href={target || (locale === "ka" ? "/en" : "/ka")}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
      )}
    >
      <Globe className="h-4 w-4" />
      {locale === "ka" ? "EN" : "KA"}
    </Link>
  );
}
