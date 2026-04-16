import { notFound } from "next/navigation";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import { buildProductMetadata } from "@/lib/seo/metadata";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const normalized = normalizeLocale(locale);
  const product = await getProductBySlug(normalized, slug);

  if (!product) {
    return {};
  }

  return buildProductMetadata({
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    path: `/${normalized}/product/${product.slug}`,
    images: product.images
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const normalized = normalizeLocale(locale);
  const product = await getProductBySlug(normalized, slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(normalized, product.slug, product.categorySlug);
  const installmentEstimate = product.price / 12;

  return (
    <div className="container-shell space-y-12 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="space-y-6">
          <Badge>{product.brand}</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{product.name}</h1>
          <p className="text-lg text-slate-600">{product.description}</p>
          <div className="flex items-end gap-4">
            <span className="text-3xl font-bold text-slate-950">{formatCurrency(product.price, getLocaleCurrency(normalized))}</span>
            {product.compareAtPrice ? <span className="text-lg text-slate-400 line-through">{formatCurrency(product.compareAtPrice, getLocaleCurrency(normalized))}</span> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
              <CreditCard className="h-5 w-5 text-[#9a6f3a]" />
              <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "ონლაინ ყიდვა" : "Buy online"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {normalized === "ka" ? "ბარათით ონლაინ გადახდა checkout-იდან." : "Complete online card payment directly from checkout."}
              </p>
            </div>
            {product.installmentAvailable ? (
              <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
                <ShieldCheck className="h-5 w-5 text-[#9a6f3a]" />
                <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "განვადება" : "Installments"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {normalized === "ka"
                    ? `ონლაინ მოთხოვნა 12 თვემდე. დაახლოებით ${installmentEstimate.toFixed(2)} GEL / თვეში.`
                    : `Online request up to 12 months. About ${installmentEstimate.toFixed(2)} GEL / month.`}
                </p>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-border bg-slate-50 p-4">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "განვადება" : "Installments"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {normalized === "ka" ? "ამ პროდუქტზე ონლაინ განვადება ამ ეტაპზე გამორთულია." : "Online installments are currently disabled for this product."}
                </p>
              </div>
            )}
            <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
              <Truck className="h-5 w-5 text-[#9a6f3a]" />
              <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "მიწოდება" : "Delivery"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {normalized === "ka" ? "თბილისში სწრაფი dispatch და რეგიონული მიწოდება." : "Fast dispatch in Tbilisi and regional delivery."}
              </p>
            </div>
          </div>
          <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? (normalized === 'ka' ? 'მარაგშია' : 'In stock') : normalized === 'ka' ? 'ამოწურულია' : 'Out of stock'}
          </p>
          <ProductActions product={product} locale={normalized} />
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">{normalized === 'ka' ? 'ტექნიკური მახასიათებლები' : 'Technical specifications'}</h2>
            <div className="mt-4 divide-y divide-border text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-6 py-3">
                  <span className="capitalize text-slate-500">{key}</span>
                  <span className="font-medium text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">{normalized === 'ka' ? 'მსგავსი პროდუქტები' : 'Related products'}</h2>
        <ProductGrid products={related} locale={normalized} />
      </section>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.slug,
            brand: { '@type': 'Brand', name: product.brand },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'GEL',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${normalized}/product/${product.slug}`
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${normalized}` },
              { '@type': 'ListItem', position: 2, name: product.categoryName, item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${normalized}/category/${product.categorySlug}` },
              { '@type': 'ListItem', position: 3, name: product.name, item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${normalized}/product/${product.slug}` }
            ]
          }
        ]}
      />
    </div>
  );
}
