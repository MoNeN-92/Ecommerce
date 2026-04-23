import { notFound } from "next/navigation";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { ProductSharePanel } from "@/components/product/product-share-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import { buildProductMetadata } from "@/lib/seo/metadata";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const normalized = normalizeLocale(locale);
  const product = await getProductBySlug(normalized, slug);

  if (!product) {
    return {};
  }

  return buildProductMetadata({
    locale: normalized,
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    path: `/${normalized}/product/${product.slug}`,
    images: product.images,
    keywords: product.keywords
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
  const productUrl = `${SITE_URL}/${normalized}/product/${product.slug}`;
  const quickFacts =
    normalized === "ka"
      ? [
          { label: "ბრენდი", value: product.brand },
          { label: "კატეგორია", value: product.categoryName },
          { label: "კოდი", value: product.sku }
        ]
      : [
          { label: "Brand", value: product.brand },
          { label: "Category", value: product.categoryName },
          { label: "SKU", value: product.sku }
        ];
  const faqItems =
    normalized === "ka"
      ? [
          {
            question: "შესაძლებელია ონლაინ ყიდვა?",
            answer: "დიახ, პროდუქტის შეძენა შესაძლებელია ონლაინ გადახდით პირდაპირ checkout გვერდიდან."
          },
          {
            question: "როგორია მიწოდების პირობები?",
            answer:
              "თბილისში საკურიერო მომსახურება უფასოა და შეკვეთის დღესვე ბარდებათ ნივთი, შესაძლებელია კურიერთან გადახდაც. რეგიონებში გაგზავნის შემთხვევაში ჯერ გადახდა უნდა განხორციელდეს და გადახდის დღესვე იგზავნება ნივთი."
          },
          {
            question: "აქვს თუ არა ონლაინ განვადება?",
            answer: product.installmentAvailable
              ? `დიახ, ამ პროდუქტზე შესაძლებელია ონლაინ განვადების მოთხოვნა. სავარაუდო თვიური გადახდა 12 თვეზე არის დაახლოებით ${installmentEstimate.toFixed(2)} GEL.`
              : "არა, ამ პროდუქტზე ონლაინ განვადება ამ ეტაპზე გამორთულია."
          }
        ]
      : [
          {
            question: "Can I buy this product online?",
            answer: "Yes, this product can be ordered online and paid for directly from checkout."
          },
          {
            question: "What are the delivery conditions?",
            answer:
              "Courier delivery in Tbilisi is free and the item is delivered on the same day. Payment to the courier is also available. For regional shipments, payment must be completed first and the item is dispatched on the same day."
          },
          {
            question: "Are online installments available?",
            answer: product.installmentAvailable
              ? `Yes, online installment requests are enabled for this product. The estimated monthly payment over 12 months is about ${installmentEstimate.toFixed(2)} GEL.`
              : "No, online installments are currently disabled for this product."
          }
        ];

  return (
    <div className="container-shell space-y-12 py-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,420px)] xl:items-start">
        <div className="min-w-0 space-y-6">
          <ProductGallery images={product.images} alt={product.name} />
          <div className="xl:hidden">
            <div className="rounded-[2rem] border border-black/[0.06] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f3a]">
                {normalized === "ka" ? "სწრაფი შეძენა" : "Quick purchase"}
              </p>
              <div className="mt-4">
                <ProductActions product={product} locale={normalized} />
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{product.brand}</Badge>
              <span className="rounded-full border border-black/[0.06] px-3 py-1 text-xs font-semibold text-slate-600">
                {product.categoryName}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {product.stock > 0 ? (normalized === "ka" ? "მარაგშია" : "In stock") : normalized === "ka" ? "ამოწურულია" : "Out of stock"}
              </span>
            </div>
            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {quickFacts.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] bg-[#faf7f2] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">{normalized === "ka" ? "სრული აღწერა" : "Full description"}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{product.description}</p>
          </div>

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

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">{normalized === "ka" ? "ხშირად დასმული კითხვები" : "Frequently asked questions"}</h2>
            <div className="mt-4 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-[1.4rem] border border-border bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="min-w-0 xl:sticky xl:top-28 xl:pt-6">
          <div className="space-y-5 rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
                <p className="text-base leading-8 text-slate-600">{product.shortDescription || product.description}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f3a]">
                {normalized === "ka" ? "შეკვეთის ინფორმაცია" : "Order information"}
              </p>
              <div className="flex flex-wrap items-end gap-4">
                <span className="text-3xl font-bold text-slate-950">{formatCurrency(product.price, getLocaleCurrency(normalized))}</span>
                {product.compareAtPrice ? <span className="text-lg text-slate-400 line-through">{formatCurrency(product.compareAtPrice, getLocaleCurrency(normalized))}</span> : null}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
                <CreditCard className="h-5 w-5 text-[#9a6f3a]" />
                <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "ონლაინ ყიდვა" : "Buy online"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {normalized === "ka" ? "ბარათით ონლაინ გადახდა შეკვეთის დასრულების ეტაპზე." : "Complete card payment securely during checkout."}
                </p>
              </div>
              {product.installmentAvailable ? (
                <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
                  <ShieldCheck className="h-5 w-5 text-[#9a6f3a]" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "ონლაინ განვადება" : "Online installments"}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {normalized === "ka"
                      ? `განვადების მოთხოვნა ხელმისაწვდომია. 12 თვეზე სავარაუდო გადასახადი დაახლოებით ${installmentEstimate.toFixed(2)} GEL არის.`
                      : `Installment requests are available. The estimated monthly payment over 12 months is about ${installmentEstimate.toFixed(2)} GEL.`}
                  </p>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-border bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "ონლაინ განვადება" : "Online installments"}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {normalized === "ka" ? "ამ პროდუქტზე ონლაინ განვადება ხელმისაწვდომი არ არის." : "Online installments are not available for this product."}
                  </p>
                </div>
              )}
              <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-4">
                <Truck className="h-5 w-5 text-[#9a6f3a]" />
                <p className="mt-3 text-sm font-semibold text-slate-950">{normalized === "ka" ? "მიწოდება" : "Delivery"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {normalized === "ka"
                    ? "თბილისში საკურიერო მომსახურება უფასოა და შეკვეთის დღესვე ბარდებათ ნივთი. რეგიონებში ჯერ გადახდა უნდა განხორციელდეს და ნივთი გადახდის დღესვე იგზავნება."
                    : "Courier delivery in Tbilisi is free and available on the same day. For regional shipments, payment is required in advance and the item is dispatched on the same day."}
                </p>
              </div>
            </div>
            <div className="hidden xl:block">
              <ProductActions product={product} locale={normalized} />
            </div>
            <ProductSharePanel locale={normalized} title={product.name} url={productUrl} />
          </div>
        </aside>
      </div>
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">{normalized === 'ka' ? 'მსგავსი პროდუქტები' : 'Related products'}</h2>
        <ProductGrid products={related} locale={normalized} />
      </section>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: product.name,
            description: product.description,
            url: productUrl,
            inLanguage: normalized,
            isPartOf: {
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.sku,
            brand: { '@type': 'Brand', name: product.brand },
            category: product.categoryName,
            ...(product.reviewCount > 0
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: Number(product.ratingAverage.toFixed(1)),
                    reviewCount: product.reviewCount
                  }
                }
              : {}),
            offers: {
              '@type': 'Offer',
              priceCurrency: 'GEL',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: productUrl,
              seller: {
                '@type': 'Organization',
                name: SITE_NAME
              }
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: normalized === 'ka' ? 'მთავარი' : 'Home', item: `${SITE_URL}/${normalized}` },
              { '@type': 'ListItem', position: 2, name: product.categoryName, item: `${SITE_URL}/${normalized}/category/${product.categorySlug}` },
              { '@type': 'ListItem', position: 3, name: product.name, item: productUrl }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          }
        ]}
      />
    </div>
  );
}
