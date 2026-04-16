import { NextResponse } from "next/server";
import { normalizeLocale } from "@/lib/i18n/config";
import { listProducts } from "@/lib/services/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = normalizeLocale(searchParams.get("locale") ?? undefined);
  const data = await listProducts(locale, Object.fromEntries(searchParams.entries()));
  return NextResponse.json(data);
}
