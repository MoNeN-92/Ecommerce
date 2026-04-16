import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { normalizeLocale } from "@/lib/i18n/config";
import { ProductGrid } from "@/components/product/product-grid";
import { getAuthSession } from "@/lib/auth/session";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata("Wishlist");

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const session = await getAuthSession();

  if (!session) {
    return (
      <div className="container-shell py-16 text-center">
        <p className="text-slate-600">Sign in to sync wishlist across devices.</p>
        <Link href="/auth/sign-in" className="mt-4 inline-block rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Sign in</Link>
      </div>
    );
  }

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } }
  });

  const products = wishlist.map(({ product }) => ({
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: normalized === 'ka' ? product.nameKa : product.nameEn,
    shortDescription: normalized === 'ka' ? product.shortDescriptionKa : product.shortDescriptionEn,
    brand: product.brand,
    image: product.images[0],
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    stock: product.stock,
    categoryName: normalized === 'ka' ? product.category.nameKa : product.category.nameEn,
    categorySlug: product.category.slug,
    featured: product.featured,
    topProduct: product.topProduct,
    installmentAvailable: product.installmentAvailable
  }));

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">Wishlist</h1>
      <ProductGrid products={products} locale={normalized} />
    </div>
  );
}
