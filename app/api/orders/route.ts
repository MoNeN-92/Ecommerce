import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/services/orders";

export async function GET() {
  const session = await requireSession();
  const orders = await getOrdersForUser(session.user.id);
  return NextResponse.json(orders);
}
