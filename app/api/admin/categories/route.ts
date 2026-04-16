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
  const payload = {
    ...body,
    slug: typeof body.slug === "string" ? body.slug.trim() : body.slug,
    nameKa:
      typeof body.nameKa === "string" && body.nameKa.trim()
        ? body.nameKa.trim()
        : typeof body.nameEn === "string"
          ? body.nameEn.trim()
          : body.nameKa,
    nameEn:
      typeof body.nameEn === "string" && body.nameEn.trim()
        ? body.nameEn.trim()
        : typeof body.nameKa === "string"
          ? body.nameKa.trim()
          : body.nameEn,
    descriptionKa:
      typeof body.descriptionKa === "string" && body.descriptionKa.trim()
        ? body.descriptionKa.trim()
        : typeof body.descriptionEn === "string" && body.descriptionEn.trim()
          ? body.descriptionEn.trim()
          : null,
    descriptionEn:
      typeof body.descriptionEn === "string" && body.descriptionEn.trim()
        ? body.descriptionEn.trim()
        : typeof body.descriptionKa === "string" && body.descriptionKa.trim()
          ? body.descriptionKa.trim()
          : null,
    image:
      typeof body.image === "string" && body.image.trim() ? body.image.trim() : null
  };
  const parsed = categorySchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Invalid category data";
    return NextResponse.json({ message: firstError, errors: fieldErrors }, { status: 400 });
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
