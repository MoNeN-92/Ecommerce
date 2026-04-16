import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? "მომსახურების პირობები" : "Terms of Service",
    description:
      normalized === "ka"
        ? "გაეცანით შეკვეთის, ფასების, მიწოდების, დაბრუნებისა და პასუხისმგებლობის ძირითად პირობებს."
        : "Review the key terms for orders, pricing, delivery, returns, and responsibilities.",
    path: `/${normalized}/terms-of-service`,
    keywords:
      normalized === "ka"
        ? ["მომსახურების პირობები", "შეკვეთის პირობები", "ონლაინ მაღაზია", "TechStore Georgia"]
        : ["terms of service", "order terms", "online store", "TechStore Georgia"]
  });
}

export default async function TermsOfServicePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const copy =
    normalized === "ka"
      ? {
          eyebrow: "Legal",
          title: "მომსახურების პირობები",
          lead:
            "საიტზე შეკვეთის განთავსებით ან ადმინისტრაციულად ინვოისის შექმნით, ეთანხმებით ქვემოთ აღწერილ ძირითად პირობებს.",
          updated: "ბოლო განახლება: 16 აპრილი, 2026",
          sections: [
            {
              title: "შეკვეთები და დადასტურება",
              paragraphs: [
                "შეკვეთის მიღება ნიშნავს მოთხოვნის რეგისტრაციას და არა ავტომატურ საბოლოო დადასტურებას. საჭიროების შემთხვევაში შეიძლება მოხდეს დამატებითი გადამოწმება stock-ის, ფასის ან საკონტაქტო მონაცემების მიხედვით.",
                "ადმინისტრაციულად შექმნილი ინვოისებიც ექვემდებარება იმავე ფასისა და მიწოდების წესებს, თუ წერილობით სხვა რამ არ არის შეთანხმებული."
              ]
            },
            {
              title: "ფასები და გადახდა",
              paragraphs: [
                "ყველა ფასი ნაჩვენებია GEL-ში, თუ სხვაგვარად არ არის მითითებული. კომპანია იტოვებს უფლებას განაახლოს ფასები, თუმცა უკვე დადასტურებული შეკვეთის ფასი უცვლელი რჩება, თუ შეცდომა აშკარად ტექნიკური არ იყო.",
                "ონლაინ გადახდა, საბანკო გადარიცხვა ან სხვა ხელმისაწვდომი მეთოდები შეიძლება განსხვავდებოდეს პროდუქტისა და მომსახურების ტიპის მიხედვით."
              ]
            },
            {
              title: "მიწოდება, გარანტია და დაბრუნება",
              paragraphs: [
                "მიწოდების ვადები არის საორიენტაციო და შეიძლება შეიცვალოს ლოგისტიკური პირობების მიხედვით. კონკრეტულ პროდუქტებზე მოქმედებს შესაბამისი გარანტიის პირობები.",
                "დაბრუნება ან გაცვლა ფასდება პროდუქტის მდგომარეობის, გახსნილი შეფუთვისა და მოქმედი კანონმდებლობის მიხედვით."
              ]
            },
            {
              title: "პასუხისმგებლობა",
              paragraphs: [
                "კომპანია პასუხს აგებს მხოლოდ იმ ზიანზე, რომელიც პირდაპირ უკავშირდება დადასტურებულ შეკვეთასა და მიწოდებას მოქმედი კანონმდებლობის ფარგლებში.",
                `ნებისმიერი საკითხის დასაზუსტებლად დაგვიკავშირდით: ${SITE_EMAIL} ან ${SITE_PHONE}.`
              ]
            }
          ],
          related: {
            privacy: "კონფიდენციალურობის პოლიტიკა",
            faq: "ხშირად დასმული კითხვები"
          }
        }
      : {
          eyebrow: "Legal",
          title: "Terms of Service",
          lead:
            "By placing an order on the site or generating an administrative invoice, you agree to the core terms described below.",
          updated: "Last updated: April 16, 2026",
          sections: [
            {
              title: "Orders and confirmation",
              paragraphs: [
                "Submitting an order means your request has been received, not that it has been automatically finalized. Additional verification may be required for stock, pricing, or contact information.",
                "Manually created invoices in the admin panel are subject to the same pricing and delivery terms unless otherwise agreed in writing."
              ]
            },
            {
              title: "Pricing and payment",
              paragraphs: [
                "All prices are displayed in GEL unless stated otherwise. The company may update pricing, but confirmed orders keep their agreed price unless an obvious technical error occurred.",
                "Available payment methods may include online card payment, bank transfer, or other methods depending on the product or service."
              ]
            },
            {
              title: "Delivery, warranty, and returns",
              paragraphs: [
                "Delivery estimates are indicative and may change based on logistics conditions. Certain products are covered by their applicable warranty terms.",
                "Returns or exchanges are assessed based on product condition, opened packaging, and applicable law."
              ]
            },
            {
              title: "Liability",
              paragraphs: [
                "The company is responsible only for damages directly related to a confirmed order and delivery within the limits of applicable law.",
                `For clarification, contact ${SITE_EMAIL} or ${SITE_PHONE}.`
              ]
            }
          ],
          related: {
            privacy: "Privacy Policy",
            faq: "Frequently asked questions"
          }
        };

  return (
    <div className="container-shell space-y-8 py-12">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6f3a]">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{copy.lead}</p>
        <p className="mt-4 text-sm font-medium text-slate-500">{copy.updated}</p>
      </section>

      <div className="grid gap-6">
        {copy.sections.map((section) => (
          <section key={section.title} className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href={`/${normalized}/privacy-policy`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.privacy}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "როგორ მუშავდება პერსონალური ინფორმაცია და cookies."
              : "Understand how personal information and cookies are handled."}
          </p>
        </Link>
        <Link
          href={`/${normalized}/faq`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.faq}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "პასუხები შეკვეთაზე, მიწოდებაზე და განვადებაზე."
              : "Answers about ordering, delivery, and installments."}
          </p>
        </Link>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: copy.title,
            description: copy.lead,
            url: `${SITE_URL}/${normalized}/terms-of-service`,
            inLanguage: normalized,
            about: {
              "@type": "Thing",
              name: normalized === "ka" ? "მომსახურების პირობები" : "Terms of Service"
            },
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL
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
                item: `${SITE_URL}/${normalized}/terms-of-service`
              }
            ]
          }
        ]}
      />
    </div>
  );
}
