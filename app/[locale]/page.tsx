import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getFeaturedContent } from "@/lib/services/catalog";
import { normalizeLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const revalidate = 300;

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
          { icon: Truck, title: "სწრაფი dispatch", description: "თბილისში same-day ვარიანტები და სწრაფი რეგიონული მიწოდება." },
          { icon: ShieldCheck, title: "უსაფრთხო შეძენა", description: "გამჭვირვალე ფასები, მკაფიო პირობები და დაცული checkout flow." },
          { icon: Headphones, title: "შერჩეული ასორტიმენტი", description: "ტექნიკა, აუდიო და ყოველდღიური გაჯეტები ერთი დახვეწილი კატალოგიდან." }
        ]
      : [
          { icon: Truck, title: "Fast dispatch", description: "Same-day options in Tbilisi and quick regional delivery." },
          { icon: ShieldCheck, title: "Secure purchase", description: "Transparent pricing, clear terms, and a protected checkout flow." },
          { icon: Headphones, title: "Curated assortment", description: "Tech, audio, and everyday gadgets from one focused catalog." }
        ];
  const heroTitle =
    normalized === "ka"
      ? "დახვეწილი ტექნიკის მაღაზია, რომელიც ვიზუალურადაც სანდოდ გამოიყურება"
      : "A refined electronics store that looks as trustworthy as it feels";
  const heroBody =
    normalized === "ka"
      ? "მშვიდი ვიზუალური ენა, მკაფიო პროდუქტის hierarchy და კომერციულ შედეგზე ორიენტირებული storefront გამოცდილება საქართველოს ბაზრისთვის."
      : "A calmer visual language, clear product hierarchy, and a storefront built for commercial trust in the Georgian market.";

  return (
    <div className="space-y-20 pb-12 pt-10">
      <section className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.6rem] border border-black/[0.06] bg-white px-7 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.06)] sm:px-10 sm:py-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#b98b52]/20 bg-[#b98b52]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a]">
              <Sparkles className="h-4 w-4" /> {t.home.trust}
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-[3.75rem] sm:leading-[1.04]">
              {heroTitle}
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
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.value} className="rounded-[1.8rem] border border-black/[0.05] bg-[#faf7f2] p-5">
                  <p className="text-3xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroCards.map((product) => (
                <Link
                  key={product.id}
                  href={`/${normalized}/product/${product.slug}`}
                  className="group overflow-hidden rounded-[1.8rem] border border-black/[0.06] bg-[#fbf8f3] p-3 transition hover:-translate-y-1"
                >
                  <div className="overflow-hidden rounded-[1.3rem] bg-white">
                    <Image src={product.image} alt={product.name} width={280} height={220} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="px-1 pb-1 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f3a]">{product.brand}</p>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-950">{product.name}</h3>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{product.price.toFixed(2)} GEL</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {spotlight ? (
              <div className="overflow-hidden rounded-[2.4rem] border border-black/[0.06] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                <div className="relative bg-[#f4efe7]">
                  <div className="absolute inset-x-16 top-6 h-24 rounded-full bg-[#b98b52]/14 blur-3xl" />
                  <Image src={spotlight.image} alt={spotlight.name} width={780} height={560} className="relative h-[360px] w-full object-cover" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-black/[0.06] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {spotlight.brand}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6f3a]">
                      {normalized === "ka" ? "ფოკუს პროდუქტი" : "Focus product"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">{spotlight.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{spotlight.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-semibold text-slate-950">{spotlight.price.toFixed(2)} GEL</p>
                    <Link href={`/${normalized}/product/${spotlight.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-[#9a6f3a]">
                      {normalized === "ka" ? "პროდუქტის ნახვა" : "View product"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              {servicePillars.map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-black/[0.06] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                  <item.icon className="h-5 w-5 text-slate-900" />
                  <h3 className="mt-4 text-base font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
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
                <Image src={category.image} alt={category.name} width={520} height={320} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
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
              {normalized === "ka" ? "სარედაქციო ბლოკი" : "Editorial block"}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
              {normalized === "ka" ? "სუფთა კომპოზიცია, რომელიც პროდუქტს წინ აყენებს" : "A cleaner composition that puts the product first"}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              {normalized === "ka"
                ? "მთავარი გვერდი ახლა უფრო სანდო retail ბრენდს ჰგავს: ნაკლები ხმაური, უკეთესი spacing და მკაფიო ვიზუალური პრიორიტეტები."
                : "The homepage now feels closer to a credible retail brand: less noise, better spacing, and clearer visual priorities."}
            </p>
          </div>

          <div className="space-y-4">
            {editorialProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${normalized}/product/${product.slug}`}
                className="group flex flex-col gap-4 rounded-[2rem] border border-black/[0.06] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 sm:flex-row sm:items-center"
              >
                <Image src={product.image} alt={product.name} width={220} height={160} className="h-40 w-full rounded-[1.5rem] object-cover sm:w-48" />
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
                {normalized === "ka" ? "ტრენდული" : "Trending"}
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">{t.home.trending}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              {normalized === "ka"
                ? "ფასზე, ბრენდზე და გამოსახულებაზე დაფუძნებული ბევრად უფრო სუფთა product grid."
                : "A much cleaner product grid built around price, brand, and image clarity."}
            </p>
          </div>
          <ProductGrid products={content.trendingProducts} locale={normalized} />
        </div>
      </section>
    </div>
  );
}
