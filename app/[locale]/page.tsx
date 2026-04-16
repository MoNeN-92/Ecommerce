import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { SaleBadge } from "@/components/product/sale-badge";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import { getFeaturedContent } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const title =
    normalized === "ka"
      ? "ტექნიკის ონლაინ მაღაზია საქართველოში"
      : "Electronics Online Store in Georgia";
  const description =
    normalized === "ka"
      ? "შეარჩიეთ ტელეფონები, ყურსასმენები, დამტენები და სხვა ტექნიკა სწრაფი მიწოდებით და უსაფრთხო ონლაინ შეძენით."
      : "Shop phones, headphones, chargers, and more electronics with fast delivery and secure online ordering in Georgia.";

  return buildPageMetadata({
    locale: normalized,
    title,
    description,
    path: `/${normalized}`,
    keywords:
      normalized === "ka"
        ? ["ტექნიკის მაღაზია", "ელექტრონიკა", "ტელეფონები", "გაჯეტები", "ონლაინ ყიდვა"]
        : ["electronics store", "phones", "gadgets", "tech shop", "buy online"]
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getMessages(normalized);
  const content = await getFeaturedContent(normalized);
  const spotlight = content.featuredProducts[0] ?? content.trendingProducts[0];
  const heroCards = [...content.featuredProducts, ...content.trendingProducts].slice(0, 4);
  const editorialProducts = (
    content.featuredProducts.length > 1 ? content.featuredProducts.slice(1) : content.trendingProducts.slice(0, 3)
  ).slice(0, 3);
  const stats =
    normalized === "ka"
      ? [
          { value: "48h", label: "საშუალო სწრაფი მიწოდება" },
          { value: "100+", label: "შერჩეული პროდუქტი" },
          { value: "4.9/5", label: "კმაყოფილი მომხმარებლები" }
        ]
      : [
          { value: "48h", label: "Average fast delivery" },
          { value: "100+", label: "Curated products" },
          { value: "4.9/5", label: "Customer satisfaction" }
        ];
  const servicePillars =
    normalized === "ka"
      ? [
          { icon: Truck, title: "სწრაფი მიწოდება", description: "თბილისში ხელმისაწვდომია ოპერატიული მიტანა, ხოლო რეგიონებში მოკლე ვადიანი მომსახურება." },
          { icon: ShieldCheck, title: "უსაფრთხო შეკვეთა", description: "გამჭვირვალე ფასები, მკაფიო პირობები და დაცული გადახდის პროცესი." },
          { icon: Headphones, title: "შერჩეული ასორტიმენტი", description: "ტექნიკა, აუდიო მოწყობილობები და ყოველდღიური აქსესუარები ერთ სივრცეში." }
        ]
      : [
          { icon: Truck, title: "Fast delivery", description: "Prompt delivery is available in Tbilisi, with short lead times across the regions." },
          { icon: ShieldCheck, title: "Secure ordering", description: "Transparent pricing, clear terms, and a protected payment process." },
          { icon: Headphones, title: "Selected assortment", description: "Technology, audio devices, and everyday accessories in one place." }
        ];
  const heroTitle =
    normalized === "ka"
      ? "ოფიციალური ონლაინ მაღაზია ტექნიკისა და აქსესუარებისთვის"
      : "A professional online store for electronics and accessories";
  const heroBody =
    normalized === "ka"
      ? "შეარჩიეთ ტელეფონები, ყურსასმენები, დამტენები და სხვა ტექნიკა მკაფიო კატალოგიდან, გამჭვირვალე პირობებითა და უსაფრთხო შეკვეთით."
      : "Browse phones, headphones, chargers, and other electronics in a clear catalog with transparent terms and secure ordering.";

  return (
    <div className="space-y-20 pb-12 pt-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: normalized === "ka" ? "მთავარი გვერდი" : "Homepage",
            description:
              normalized === "ka"
                ? "ტექნიკის კატალოგი საქართველოში სწრაფი მიწოდებით და ონლაინ შეძენის შესაძლებლობით."
                : "Technology catalog in Georgia with fast delivery and online purchase options.",
            url: `${SITE_URL}/${normalized}`,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: heroCards.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/${normalized}/product/${product.slug}`,
              name: product.name
            }))
          }
        ]}
      />
      <section className="container-shell">
        <div className="overflow-hidden rounded-[2.8rem] border border-black/[0.06] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
            <div className="relative overflow-hidden rounded-[2.4rem] bg-[#fbf8f3] px-6 py-7 sm:px-8 sm:py-9">
              <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-[#b98b52]/12 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-[#162033]/[0.05] blur-3xl" />
              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#b98b52]/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a] backdrop-blur">
                  <Sparkles className="h-4 w-4" /> {t.home.trust}
                </p>
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-[4rem] sm:leading-[1.02]">
                  <span className="text-gradient">{heroTitle}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{heroBody}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href={`/${normalized}/products`}>
                    <Button className="px-6">{t.home.ctaPrimary}</Button>
                  </Link>
                  <Link href={`/${normalized}/products?featured=true`}>
                    <Button variant="secondary" className="px-6">{t.home.ctaSecondary}</Button>
                  </Link>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div key={item.value} className="rounded-[1.5rem] border border-black/[0.05] bg-white/82 px-4 py-4 backdrop-blur">
                      <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {servicePillars.map((item) => (
                    <div key={item.title} className="rounded-[1.4rem] border border-black/[0.05] bg-white/70 px-4 py-4 backdrop-blur">
                      <item.icon className="h-5 w-5 text-slate-900" />
                      <h3 className="mt-3 text-sm font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-rows-[minmax(0,1fr)_auto]">
              {spotlight ? (
                <div className="overflow-hidden rounded-[2.3rem] border border-black/[0.06] bg-[#f4efe7]">
                  <div className="relative grid gap-5 p-5 sm:p-6">
                    <SaleBadge price={spotlight.price} compareAtPrice={spotlight.compareAtPrice} className="left-5 top-5" />
                    <div className="absolute inset-x-20 top-4 h-24 rounded-full bg-[#b98b52]/16 blur-3xl" />
                    <div className="relative overflow-hidden rounded-[1.8rem] bg-white">
                      <RemoteImage src={spotlight.image} alt={spotlight.name} width={820} height={560} sizes="(max-width: 1280px) 100vw, 42vw" className="h-[320px] w-full object-cover" priority />
                    </div>
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                            {spotlight.brand}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a]">
                            {normalized === "ka" ? "დღის გამორჩეული არჩევანი" : "Featured selection"}
                          </span>
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-slate-950">{spotlight.name}</h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{spotlight.shortDescription}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-semibold text-slate-950">{spotlight.price.toFixed(2)} GEL</p>
                        {spotlight.compareAtPrice ? <p className="mt-2 text-sm text-slate-400 line-through">{spotlight.compareAtPrice.toFixed(2)} GEL</p> : null}
                      </div>
                    </div>
                    <Link href={`/${normalized}/product/${spotlight.slug}`} className="relative inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-[#9a6f3a]">
                      {normalized === "ka" ? "პროდუქტის ნახვა" : "View product"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                {heroCards.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${normalized}/product/${product.slug}`}
                    className="group grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3 rounded-[1.8rem] border border-black/[0.06] bg-white p-3 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                  >
                    <div className="relative overflow-hidden rounded-[1.2rem] bg-[#f7f2ea]">
                      <SaleBadge price={product.price} compareAtPrice={product.compareAtPrice} className="left-2 top-2 scale-[0.82]" />
                      <RemoteImage src={product.image} alt={product.name} width={220} height={220} sizes="112px" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="min-w-0 pr-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a6f3a]">{product.brand}</p>
                      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-950">{product.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{product.categoryName}</p>
                      <p className="mt-3 text-base font-semibold text-slate-950">{product.price.toFixed(2)} GEL</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#9a6f3a]">
              {normalized === "ka" ? "კატეგორიები" : "Categories"}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">{t.home.categories}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{t.home.featuredDeals}</p>
          </div>
          <Link href={`/${normalized}/products`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#9a6f3a]">
            {normalized === "ka" ? "ყველა პროდუქტი" : "See all products"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {content.categories.map((category) => (
            <Link
              key={category.id}
              href={`/${normalized}/category/${category.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
            >
              <div className="overflow-hidden bg-[#f4efe7]">
                <RemoteImage src={category.image} alt={category.name} width={520} height={320} kind="category" sizes="(max-width: 1280px) 50vw, 25vw" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a]">
                  {normalized === "ka" ? "არჩეული მიმართულება" : "Selected collection"}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.5rem] border border-black/[0.06] bg-[#162033] p-8 text-white shadow-[0_28px_70px_rgba(15,23,42,0.12)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d8b486]">
              {normalized === "ka" ? "გამორჩეული შეთავაზებები" : "Featured selection"}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
              {normalized === "ka" ? "პროდუქტები, რომლებიც განსაკუთრებით მოთხოვნადია" : "Products that stand out in the current selection"}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              {normalized === "ka"
                ? "მთავარ გვერდზე გამოკვეთილია მოთხოვნადი პოზიციები, აქტუალური კატეგორიები და სწრაფად საპოვნელი ძირითადი შეთავაზებები."
                : "The homepage highlights in-demand items, key categories, and the most relevant offers in a clear structure."}
            </p>
          </div>

          <div className="space-y-4">
            {editorialProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${normalized}/product/${product.slug}`}
                className="group flex flex-col gap-4 rounded-[2rem] border border-black/[0.06] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 sm:flex-row sm:items-center"
              >
                <div className="relative">
                  <SaleBadge price={product.price} compareAtPrice={product.compareAtPrice} />
                  <RemoteImage src={product.image} alt={product.name} width={220} height={160} sizes="(max-width: 640px) 100vw, 220px" className="h-40 w-full rounded-[1.5rem] object-cover sm:w-48" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a]">{product.brand}</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{product.name}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold text-slate-950">{product.price.toFixed(2)} GEL</span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-[#9a6f3a]">
                      {normalized === "ka" ? "დეტალები" : "Details"} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="rounded-[2.5rem] border border-black/[0.06] bg-white px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.05)] sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#9a6f3a]">
                {normalized === "ka" ? "პოპულარული" : "Popular"}
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">{t.home.trending}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              {normalized === "ka"
                ? "პროდუქტები დალაგებულია მკაფიო სტრუქტურით, რათა მარტივად შეაფასოთ ფასი, ბრენდი და ძირითადი მახასიათებლები."
                : "Products are arranged in a clear structure so price, brand, and key details are easy to compare."}
            </p>
          </div>
          <ProductGrid products={content.trendingProducts} locale={normalized} />
        </div>
      </section>
    </div>
  );
}
