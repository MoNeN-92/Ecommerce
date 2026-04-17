import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE_DISPLAY, SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? "ხშირად დასმული კითხვები" : "Frequently Asked Questions",
    description:
      normalized === "ka"
        ? "პასუხები შეკვეთაზე, მიწოდებაზე, განვადებაზე, გარანტიაზე და ინვოისებზე."
        : "Answers about ordering, delivery, installments, warranties, and invoices.",
    path: `/${normalized}/faq`,
    keywords:
      normalized === "ka"
        ? ["FAQ", "ხშირად დასმული კითხვები", "მიწოდება", "განვადება", "Joker Shops"]
        : ["FAQ", "frequently asked questions", "delivery", "installments", "Joker Shops"]
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const content =
    normalized === "ka"
      ? {
          eyebrow: "Help",
          title: "ხშირად დასმული კითხვები",
          lead: "ეს გვერდი აჯამებს იმ მთავარ კითხვებს, რომლებიც ყველაზე ხშირად ჩნდება შეკვეთების, მიწოდების და გადახდის პროცესში.",
          items: [
            {
              question: "როგორ შევუკვეთო პროდუქტი ონლაინ?",
              answer: "აირჩიეთ პროდუქტი, დაამატეთ კალათაში და დაასრულეთ შეკვეთა checkout გვერდიდან."
            },
            {
              question: "შესაძლებელია ონლაინ განვადება?",
              answer: "დიახ, იმ პროდუქტებზე სადაც განვადება ჩართულია, checkout-ზე ჩანს შესაბამისი მოთხოვნის ვარიანტი."
            },
            {
              question: "რამდენ ხანში ხდება მიწოდება?",
              answer: "თბილისში მიწოდება ჩვეულებრივ უფრო სწრაფია, ხოლო რეგიონებში დამოკიდებულია მისამართსა და გადამზიდზე."
            },
            {
              question: "შემიძლია ინვოისის მიღება?",
              answer: "დიახ, ადმინისტრაციულ გაყიდვებზეც და ონლაინ შეკვეთებზეც ინვოისის გენერაცია შესაძლებელია."
            },
            {
              question: "პროდუქტს აქვს გარანტია?",
              answer: "გარანტიის პირობები დამოკიდებულია კონკრეტულ პროდუქტსა და ბრენდზე. დეტალები მითითებულია პროდუქტის გვერდზე ან ინვოისში."
            },
            {
              question: "როგორ დაგიკავშირდეთ?",
              answer: `დაგვიკავშირდით ელფოსტაზე ${SITE_EMAIL} ან ტელეფონზე ${SITE_PHONE_DISPLAY}.`
            }
          ],
          related: {
            privacy: "კონფიდენციალურობის პოლიტიკა",
            terms: "მომსახურების პირობები"
          }
        }
      : {
          eyebrow: "Help",
          title: "Frequently Asked Questions",
          lead: "This page summarizes the most common questions around ordering, delivery, and payment.",
          items: [
            {
              question: "How do I order a product online?",
              answer: "Choose a product, add it to cart, and complete the purchase from checkout."
            },
            {
              question: "Are online installments available?",
              answer: "Yes, products with installments enabled show the relevant request option at checkout."
            },
            {
              question: "How long does delivery take?",
              answer: "Delivery is usually faster in Tbilisi, while regional timing depends on the destination and carrier."
            },
            {
              question: "Can I receive an invoice?",
              answer: "Yes, invoices can be generated for both administrative sales and online orders."
            },
            {
              question: "Does the product include a warranty?",
              answer: "Warranty terms depend on the specific product and brand. Details are shown on the product page or invoice."
            },
            {
              question: "How can I contact you?",
              answer: `Contact us at ${SITE_EMAIL} or ${SITE_PHONE_DISPLAY}.`
            }
          ],
          related: {
            privacy: "Privacy Policy",
            terms: "Terms of Service"
          }
        };

  return (
    <div className="container-shell space-y-8 py-12">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6f3a]">{content.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950">{content.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{content.lead}</p>
      </section>

      <section className="space-y-4">
        {content.items.map((item) => (
          <article key={item.question} className="rounded-[2rem] border border-border bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">{item.question}</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href={`/${normalized}/privacy-policy`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{content.related.privacy}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "გაეცანით მონაცემების დამუშავებისა და cookies-ის წესებს."
              : "Review how data and cookies are handled."}
          </p>
        </Link>
        <Link
          href={`/${normalized}/terms-of-service`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{content.related.terms}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "გაეცანით შეკვეთების, მიწოდებისა და პასუხისმგებლობის პირობებს."
              : "Read the terms covering orders, delivery, and responsibilities."}
          </p>
        </Link>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
              }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: content.title,
            description: content.lead,
            url: `${SITE_URL}/${normalized}/faq`,
            inLanguage: normalized,
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
                name: content.title,
                item: `${SITE_URL}/${normalized}/faq`
              }
            ]
          }
        ]}
      />
    </div>
  );
}
