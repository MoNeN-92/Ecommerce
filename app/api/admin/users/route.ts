import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/session";
import { getAdminUsers } from "@/lib/services/users";

export async function GET() {
  await requireSuperAdmin();
  const users = await getAdminUsers();
  return NextResponse.json(users);
}
