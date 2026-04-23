import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireSuperAdmin } from "@/lib/auth/session";
import { isSuperAdminEmail } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;
  const body = await request.json();

  if (body.role !== Role.USER && body.role !== Role.ADMIN) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

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

  const updated = await prisma.user.update({
    where: { id },
    data: { role: body.role },
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  return NextResponse.json(updated);
}
