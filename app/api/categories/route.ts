import { NextResponse } from "next/server";
import { normalizeLocale } from "@/lib/i18n/config";
import { getCategories } from "@/lib/services/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = normalizeLocale(searchParams.get("locale") ?? undefined);
  const categories = await getCategories(locale);
  return NextResponse.json(categories);
}
