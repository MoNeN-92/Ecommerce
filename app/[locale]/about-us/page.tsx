import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  COMPANY_IDENTIFIER,
  COMPANY_NAME,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_URL
} from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? "კომპანიის შესახებ" : "About Us",
    description:
      normalized === "ka"
        ? "გაეცანით Joker Shops-ის საქმიანობას, საკონტაქტო მონაცემებს და მომსახურების ძირითად პრინციპებს."
        : "Learn about Joker Shops, its contact details, and the core principles behind the service.",
    path: `/${normalized}/about-us`,
    keywords:
      normalized === "ka"
        ? ["კომპანიის შესახებ", "Joker Shops", "ონლაინ მაღაზია", "ტექნიკა"]
        : ["about us", "Joker Shops", "online store", "electronics"]
  });
}

export default async function AboutUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  const copy =
    normalized === "ka"
      ? {
          eyebrow: "კომპანია",
          title: "კომპანიის შესახებ",
          lead:
            "Joker Shops არის ტექნიკისა და აქსესუარების ონლაინ მაღაზია, რომელიც მომხმარებელს სთავაზობს მკაფიო პირობებს, უსაფრთხო შეკვეთას და სწრაფ კომუნიკაციას.",
          cards: [
            { label: "იურიდიული ფორმა", value: COMPANY_NAME },
            { label: "საიდენტიფიკაციო კოდი", value: COMPANY_IDENTIFIER },
            { label: "ელფოსტა", value: SITE_EMAIL },
            { label: "ტელეფონი", value: SITE_PHONE_DISPLAY }
          ],
          sections: [
            {
              title: "რას გთავაზობთ",
              text: "ჩვენი კატალოგი აერთიანებს ტელეფონებს, ყურსასმენებს, დამტენებს, გაჯეტებს და სხვა მოთხოვნად ტექნიკას. თითოეულ პროდუქტზე წარმოდგენილია ფასი, ძირითადი მახასიათებლები და შეკვეთისთვის საჭირო ინფორმაცია."
            },
            {
              title: "როგორ ვმუშაობთ",
              text: "მთავარი პრინციპია მკაფიო შეთავაზება, გამჭვირვალე პირობები და ოპერატიული უკუკავშირი. შეკვეთების დამუშავება მიმდინარეობს როგორც საიტიდან, ისე ადმინისტრაციული ინვოისის მეშვეობით."
            },
            {
              title: "მომხმარებელთან კომუნიკაცია",
              text: "კითხვების, შეკვეთების, ინვოისებისა და მომსახურების დეტალების დაზუსტებისთვის დაგვიკავშირდით ტელეფონით ან ელფოსტით."
            }
          ],
          related: {
            faq: "ხშირად დასმული კითხვები",
            terms: "მომსახურების პირობები"
          }
        }
      : {
          eyebrow: "Company",
          title: "About Us",
          lead:
            "Joker Shops is an online store for electronics and accessories focused on clear terms, secure ordering, and responsive customer communication.",
          cards: [
            { label: "Legal entity", value: COMPANY_NAME },
            { label: "Identification code", value: COMPANY_IDENTIFIER },
            { label: "Email", value: SITE_EMAIL },
            { label: "Phone", value: SITE_PHONE_DISPLAY }
          ],
          sections: [
            {
              title: "What we offer",
              text: "Our catalog includes phones, headphones, chargers, gadgets, and other high-demand electronics. Each product includes pricing, core specifications, and ordering information."
            },
            {
              title: "How we operate",
              text: "We focus on clear offers, transparent terms, and prompt communication. Orders are handled both through the website and through administrative invoices when needed."
            },
            {
              title: "Customer communication",
              text: "For questions about orders, invoices, delivery, or service terms, contact us by phone or email."
            }
          ],
          related: {
            faq: "Frequently asked questions",
            terms: "Terms of Service"
          }
        };

  return (
    <div className="container-shell space-y-8 py-12">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6f3a]">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{copy.lead}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {copy.cards.map((card) => (
          <article key={card.label} className="rounded-[1.8rem] border border-border bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6f3a]">{card.label}</p>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-950">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6">
        {copy.sections.map((section) => (
          <article key={section.title} className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{section.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href={`/${normalized}/terms-of-service`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.terms}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "გაეცანით შეკვეთების, მიწოდებისა და პასუხისმგებლობის ძირითად პირობებს."
              : "Review the core terms covering orders, delivery, and responsibilities."}
          </p>
        </Link>
        <Link
          href={`/${normalized}/faq`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.faq}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "პასუხები შეკვეთაზე, მიწოდებაზე და ონლაინ გადახდაზე."
              : "Answers about ordering, delivery, and online payments."}
          </p>
        </Link>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: copy.title,
            description: copy.lead,
            url: `${SITE_URL}/${normalized}/about-us`,
            inLanguage: normalized,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL
            },
            about: {
              "@type": "Organization",
              name: COMPANY_NAME,
              taxID: COMPANY_IDENTIFIER,
              email: SITE_EMAIL,
              telephone: SITE_PHONE_DISPLAY
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: normalized === "ka" ? "მთავარი" : "Home",
                item: `${SITE_URL}/${normalized}`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: copy.title,
                item: `${SITE_URL}/${normalized}/about-us`
              }
            ]
          }
        ]}
      />
    </div>
  );
}
