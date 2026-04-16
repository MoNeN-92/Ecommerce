import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createAddress } from "@/lib/services/account";

export async function GET() {
  const session = await requireSession();
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });
  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const address = await createAddress(session.user.id, body);
  return NextResponse.json(address);
}
