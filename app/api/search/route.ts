import { NextResponse } from "next/server";
import { normalizeLocale } from "@/lib/i18n/config";
import { searchProducts } from "@/lib/services/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const locale = normalizeLocale(searchParams.get("locale") ?? undefined);

  if (q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const results = await searchProducts(locale, q);
  return NextResponse.json(results);
}
