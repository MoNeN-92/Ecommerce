import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { updateOrderStatus } from "@/lib/services/orders";
import { orderStatusSchema } from "@/lib/validators/checkout";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const order = await updateOrderStatus(id, parsed.data);
  return NextResponse.json(order);
}
