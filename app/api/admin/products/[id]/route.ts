import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/lib/validators/catalog";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const payload = {
    ...body,
    slug: typeof body.slug === "string" ? body.slug.trim() : body.slug,
    sku: typeof body.sku === "string" ? body.sku.trim() : body.sku,
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
    shortDescriptionKa:
      typeof body.shortDescriptionKa === "string" && body.shortDescriptionKa.trim()
        ? body.shortDescriptionKa.trim()
        : typeof body.shortDescriptionEn === "string" && body.shortDescriptionEn.trim()
          ? body.shortDescriptionEn.trim()
          : null,
    shortDescriptionEn:
      typeof body.shortDescriptionEn === "string" && body.shortDescriptionEn.trim()
        ? body.shortDescriptionEn.trim()
        : typeof body.shortDescriptionKa === "string" && body.shortDescriptionKa.trim()
          ? body.shortDescriptionKa.trim()
          : null,
    descriptionKa:
      typeof body.descriptionKa === "string" && body.descriptionKa.trim()
        ? body.descriptionKa.trim()
        : typeof body.descriptionEn === "string"
          ? body.descriptionEn.trim()
          : body.descriptionKa,
    descriptionEn:
      typeof body.descriptionEn === "string" && body.descriptionEn.trim()
        ? body.descriptionEn.trim()
        : typeof body.descriptionKa === "string"
          ? body.descriptionKa.trim()
          : body.descriptionEn,
    seoTitleKa:
      typeof body.seoTitleKa === "string" && body.seoTitleKa.trim()
        ? body.seoTitleKa.trim()
        : null,
    seoTitleEn:
      typeof body.seoTitleEn === "string" && body.seoTitleEn.trim()
        ? body.seoTitleEn.trim()
        : null,
    seoDescriptionKa:
      typeof body.seoDescriptionKa === "string" && body.seoDescriptionKa.trim()
        ? body.seoDescriptionKa.trim()
        : null,
    seoDescriptionEn:
      typeof body.seoDescriptionEn === "string" && body.seoDescriptionEn.trim()
        ? body.seoDescriptionEn.trim()
        : null,
    brand: typeof body.brand === "string" ? body.brand.trim() : body.brand,
    images: Array.isArray(body.images)
      ? body.images.map((item: unknown) => (typeof item === "string" ? item.trim() : item)).filter(Boolean)
      : body.images,
    metaKeywords: Array.isArray(body.metaKeywords)
      ? body.metaKeywords.map((item: unknown) => (typeof item === "string" ? item.trim() : item)).filter(Boolean)
      : body.metaKeywords
  };
  const parsed = productSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Invalid product data";
    return NextResponse.json({ message: firstError, errors: fieldErrors }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Product slug or SKU already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  await prisma.product.delete({
    where: { id }
  });
  return NextResponse.json({ success: true });
}
