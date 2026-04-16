import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminAnalytics } from "@/lib/services/analytics";

export async function GET() {
  await requireAdmin();
  const data = await getAdminAnalytics();
  return NextResponse.json(data);
}
