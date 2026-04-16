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
    title: normalized === "ka" ? "კონფიდენციალურობის პოლიტიკა" : "Privacy Policy",
    description:
      normalized === "ka"
        ? "გაეცანით როგორ აგროვებს, ინახავს და ამუშავებს TechStore Georgia მომხმარებლის მონაცემებს."
        : "Learn how TechStore Georgia collects, stores, and processes customer data.",
    path: `/${normalized}/privacy-policy`,
    keywords:
      normalized === "ka"
        ? ["კონფიდენციალურობის პოლიტიკა", "პერსონალური მონაცემები", "cookies", "TechStore Georgia"]
        : ["privacy policy", "personal data", "cookies", "TechStore Georgia"]
  });
}

export default async function PrivacyPolicyPage({
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
          title: "კონფიდენციალურობის პოლიტიკა",
          lead:
            "ეს გვერდი აღწერს რა ინფორმაციას ვაგროვებთ, რისთვის ვიყენებთ მას და როგორ შეგიძლიათ თქვენი მონაცემების მართვა.",
          updated: "ბოლო განახლება: 16 აპრილი, 2026",
          sections: [
            {
              title: "რა ინფორმაციას ვაგროვებთ",
              paragraphs: [
                "ვაგროვებთ ინფორმაციას, რომელსაც თავად გვაწვდით შეკვეთის, რეგისტრაციის, ინვოისის ან მხარდაჭერის მოთხოვნის დროს. ეს შეიძლება მოიცავდეს სახელს, ტელეფონს, ელფოსტას, მისამართს და შეკვეთის დეტალებს.",
                "ტექნიკური ანალიტიკისთვის შესაძლოა დამუშავდეს IP მისამართი, მოწყობილობის ტიპი, ბრაუზერის მონაცემები და cookie-ებთან დაკავშირებული ინფორმაცია."
              ]
            },
            {
              title: "როგორ ვიყენებთ ინფორმაციას",
              paragraphs: [
                "მონაცემები გამოიყენება შეკვეთების დამუშავებისთვის, მიწოდების ორგანიზებისთვის, ინვოისების გენერაციისთვის, მომხმარებელთან კომუნიკაციისთვის და სერვისის გაუმჯობესებისთვის.",
                "მარკეტინგული კომუნიკაცია იგზავნება მხოლოდ იქ, სადაც ეს დასაშვებია კანონით ან თქვენგან მიღებული თანხმობით."
              ]
            },
            {
              title: "გაზიარება და დაცვა",
              paragraphs: [
                "მონაცემებს ვუზიარებთ მხოლოდ იმ პარტნიორებს, რომლებიც აუცილებელია გადახდის, ჰოსტინგის, მიწოდების ან ტექნიკური მხარდაჭერისთვის.",
                "ვიყენებთ გონივრულ ტექნიკურ და ორგანიზაციულ ზომებს, თუმცა ინტერნეტით გადაცემული ინფორმაციის სრული უსაფრთხოების გარანტია ტექნიკურად შეუძლებელია."
              ]
            },
            {
              title: "თქვენი უფლებები",
              paragraphs: [
                "შეგიძლიათ მოითხოვოთ თქვენი მონაცემების ნახვა, კორექტირება, განახლება ან წაშლა, თუ ეს ეწინააღმდეგება არა კანონიერ საბუღალტრო ან საგადასახადო ვალდებულებებს.",
                `ამ საკითხებზე დაგვიკავშირდით: ${SITE_EMAIL} ან ${SITE_PHONE}.`
              ]
            }
          ],
          related: {
            faq: "ხშირად დასმული კითხვები",
            terms: "მომსახურების პირობები"
          }
        }
      : {
          eyebrow: "Legal",
          title: "Privacy Policy",
          lead:
            "This page explains what information we collect, how we use it, and how you can manage your personal data.",
          updated: "Last updated: April 16, 2026",
          sections: [
            {
              title: "What we collect",
              paragraphs: [
                "We collect information you provide when placing an order, registering an account, requesting an invoice, or contacting support. This may include your name, phone number, email address, delivery address, and order details.",
                "For analytics and security, we may also process your IP address, device type, browser details, and cookie-related information."
              ]
            },
            {
              title: "How we use information",
              paragraphs: [
                "Data is used to process orders, arrange delivery, generate invoices, communicate with customers, and improve the service.",
                "Marketing communication is sent only where permitted by law or based on your consent."
              ]
            },
            {
              title: "Sharing and protection",
              paragraphs: [
                "We share data only with providers necessary for payments, hosting, delivery, or technical support.",
                "We use reasonable technical and organizational safeguards, but no internet transmission can be guaranteed to be completely secure."
              ]
            },
            {
              title: "Your rights",
              paragraphs: [
                "You may request access, correction, update, or deletion of your personal data where this does not conflict with legal accounting or tax obligations.",
                `For privacy requests, contact us at ${SITE_EMAIL} or ${SITE_PHONE}.`
              ]
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
          href={`/${normalized}/terms-of-service`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.terms}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "შეკვეთების, ფასების, მიწოდებისა და პასუხისმგებლობის პირობები."
              : "Review order, pricing, delivery, and responsibility terms."}
          </p>
        </Link>
        <Link
          href={`/${normalized}/faq`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.faq}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "მიწოდების, განვადებისა და ონლაინ შეკვეთების მოკლე პასუხები."
              : "Quick answers about delivery, installments, and online ordering."}
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
            url: `${SITE_URL}/${normalized}/privacy-policy`,
            inLanguage: normalized,
            about: {
              "@type": "Thing",
              name: normalized === "ka" ? "კონფიდენციალურობა" : "Privacy"
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
                item: `${SITE_URL}/${normalized}/privacy-policy`
              }
            ]
          }
        ]}
      />
    </div>
  );
}
