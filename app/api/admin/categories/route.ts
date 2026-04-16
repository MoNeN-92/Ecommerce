import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validators/catalog";

export async function GET() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: parsed.data
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Category slug already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}
