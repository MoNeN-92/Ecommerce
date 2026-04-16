import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createManualInvoice } from "@/lib/services/orders";

export async function GET() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shippingAddress: true
    }
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();

  try {
    const order = await createManualInvoice(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Manual invoice creation failed"
      },
      { status: 400 }
    );
  }
}
