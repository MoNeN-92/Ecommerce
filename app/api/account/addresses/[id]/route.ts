import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { updateAddress } from "@/lib/services/account";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const body = await request.json();
  const { id } = await params;
  const address = await updateAddress(session.user.id, id, body);
  return NextResponse.json(address);
}
