import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { updateProfile } from "@/lib/services/account";

export async function PATCH(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const user = await updateProfile(session.user.id, body);
  return NextResponse.json(user);
}
