import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { getOrderById } from "@/lib/services/orders";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  const order = await getOrderById(id, session.user.id);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
