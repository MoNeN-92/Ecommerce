import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { requireSuperAdmin } from "@/lib/auth/session";
import { isSuperAdminEmail } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;
  const body = await request.json();

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true
    }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (isSuperAdminEmail(user.email)) {
    return NextResponse.json({ message: "Super admin role cannot be changed" }, { status: 403 });
  }

  const updates: { role?: Role; password?: string } = {};

  if (body.role !== undefined) {
    if (body.role !== Role.USER && body.role !== Role.ADMIN) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    updates.role = body.role;
  }

  if (body.password !== undefined) {
    const nextPassword = typeof body.password === "string" ? body.password.trim() : "";

    if (nextPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    updates.password = await hash(nextPassword, 10);
  }

  if (!updates.role && !updates.password) {
    return NextResponse.json({ message: "No valid changes submitted" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updates,
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  return NextResponse.json(updated);
}
