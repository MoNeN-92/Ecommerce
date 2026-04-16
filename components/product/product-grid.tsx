import { ProductCard } from "@/components/product/product-card";
import type { ProductCardItem } from "@/types";

export function ProductGrid({ products, locale }: { products: ProductCardItem[]; locale: "ka" | "en" }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
