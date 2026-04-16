import { NextResponse } from "next/server";
import { priceCartItems } from "@/lib/services/orders";
import { cartSyncSchema } from "@/lib/validators/checkout";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = cartSyncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = await priceCartItems(parsed.data.items);
  return NextResponse.json(data);
}
