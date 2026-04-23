import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { normalizeLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { COMPANY_IDENTIFIER, COMPANY_NAME, SITE_EMAIL, SITE_NAME, SITE_PHONE_DISPLAY, SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  return buildPageMetadata({
    locale: normalized,
    title: normalized === "ka" ? "მიწოდება, დაბრუნება და თანხის დაბრუნება" : "Delivery, Returns, and Refunds",
    description:
      normalized === "ka"
        ? "გაეცანით მიწოდების ვადებს, შეკვეთის გაუქმების წესს, დაბრუნების პირობებს და თანხის დაბრუნების პროცესს."
        : "Review delivery timelines, cancellation rules, return conditions, and the refund process.",
    path: `/${normalized}/delivery-returns-refunds`,
    keywords:
      normalized === "ka"
        ? ["მიწოდება", "დაბრუნება", "გაუქმება", "თანხის დაბრუნება", "Joker Shops"]
        : ["delivery", "returns", "cancellation", "refunds", "Joker Shops"]
  });
}

export default async function DeliveryReturnsRefundsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);

  const copy =
    normalized === "ka"
      ? {
          eyebrow: "სერვისი",
          title: "მიწოდება, დაბრუნება და თანხის დაბრუნება",
          lead:
            "ეს გვერდი აღწერს შეკვეთის მიწოდების, გაუქმების, დაბრუნებისა და თანხის დაბრუნების ძირითად პირობებს.",
          updated: "ბოლო განახლება: 17 აპრილი, 2026",
          sections: [
            {
              title: "კომპანიის მონაცემები",
              paragraphs: [
                `${COMPANY_NAME}, საიდენტიფიკაციო კოდი ${COMPANY_IDENTIFIER}.`,
                `საკონტაქტო მონაცემები: ${SITE_EMAIL}, ${SITE_PHONE_DISPLAY}.`
              ]
            },
            {
              title: "მიწოდების პირობები",
              paragraphs: [
                "თბილისში საკურიერო მომსახურება უფასოა და შეკვეთის დღესვე ბარდებათ ნივთი.",
                "თბილისში შესაძლებელია კურიერთან გადახდაც.",
                "რეგიონებში გაგზავნის შემთხვევაში ჯერ გადახდა უნდა განხორციელდეს და გადახდის დღესვე იგზავნება ნივთი."
              ]
            },
            {
              title: "შეკვეთის გაუქმება",
              paragraphs: [
                "მომხმარებელს შეუძლია შეკვეთის გაუქმების მოთხოვნა მანამდე, სანამ შეკვეთა გადაეცემა მიწოდების სამსახურს ან არ დაიწყება მისი შესრულება.",
                "თუ შეკვეთის დამუშავება უკვე დაწყებულია, გაუქმების შესაძლებლობა ფასდება კონკრეტული შეკვეთის სტატუსის მიხედვით."
              ]
            },
            {
              title: "დაბრუნების პირობები",
              paragraphs: [
                "პროდუქტის დაბრუნება შესაძლებელია იმ შემთხვევაში, თუ პროდუქტი არ არის გამოყენებული, დაცულია მისი სასაქონლო სახე და თან ახლავს შესაბამისი დოკუმენტაცია.",
                "გახსნილი ან დაზიანებული შეფუთვის, გამოყენების კვალის ან მომხმარებლის მიერ დაზიანების შემთხვევაში დაბრუნება შეიძლება შეიზღუდოს მოქმედი წესების შესაბამისად.",
                "ტექნიკურ ხარვეზთან დაკავშირებული საკითხები განიხილება საგარანტიო პირობების და მოქმედი კანონმდებლობის შესაბამისად."
              ]
            },
            {
              title: "თანხის დაბრუნება",
              paragraphs: [
                "თუ დაბრუნების მოთხოვნა დაკმაყოფილდა, თანხის დაბრუნება ხორციელდება იმავე გადახდის მეთოდით ან სხვა შეთანხმებული წესით.",
                "თანხის დაბრუნების ვადა დამოკიდებულია გადახდის მეთოდზე, ბანკის დამუშავების წესზე და ადმინისტრაციულ შემოწმებაზე.",
                `დეტალების დასაზუსტებლად დაგვიკავშირდით: ${SITE_EMAIL} ან ${SITE_PHONE_DISPLAY}.`
              ]
            }
          ],
          related: {
            terms: "მომსახურების პირობები",
            privacy: "კონფიდენციალურობის პოლიტიკა"
          }
        }
      : {
          eyebrow: "Service",
          title: "Delivery, Returns, and Refunds",
          lead:
            "This page explains the main terms for delivery, order cancellation, product returns, and refunds.",
          updated: "Last updated: April 17, 2026",
          sections: [
            {
              title: "Company details",
              paragraphs: [
                `${COMPANY_NAME}, identification code ${COMPANY_IDENTIFIER}.`,
                `Contact details: ${SITE_EMAIL}, ${SITE_PHONE_DISPLAY}.`
              ]
            },
            {
              title: "Delivery terms",
              paragraphs: [
                "Courier delivery in Tbilisi is free and the item is delivered on the same day.",
                "Cash payment to the courier is also available in Tbilisi.",
                "For regional shipments, payment must be completed first and the item is dispatched on the same day."
              ]
            },
            {
              title: "Order cancellation",
              paragraphs: [
                "Customers may request cancellation before the order is handed over for delivery or before fulfillment has materially started.",
                "If processing has already started, cancellation is reviewed according to the current order status."
              ]
            },
            {
              title: "Return conditions",
              paragraphs: [
                "A product may be returned if it has not been used, remains in saleable condition, and includes the relevant documentation.",
                "Returns may be limited where packaging is opened or damaged, where there are signs of use, or where the product has been damaged by the customer.",
                "Technical defect cases are handled according to applicable warranty terms and relevant law."
              ]
            },
            {
              title: "Refund process",
              paragraphs: [
                "If a return request is approved, the refund is issued through the original payment method or another agreed method.",
                "Refund timing depends on the payment method, banking procedures, and the necessary administrative review.",
                `For clarification, contact ${SITE_EMAIL} or ${SITE_PHONE_DISPLAY}.`
              ]
            }
          ],
          related: {
            terms: "Terms of Service",
            privacy: "Privacy Policy"
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
              ? "შეკვეთების, ფასების და პასუხისმგებლობის ძირითადი პირობები."
              : "The core terms covering orders, pricing, and responsibilities."}
          </p>
        </Link>
        <Link
          href={`/${normalized}/privacy-policy`}
          className="rounded-[2rem] border border-border bg-[#fbf6ee] p-6 transition hover:border-[#9a6f3a]/30"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.related.privacy}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {normalized === "ka"
              ? "გაეცანით მონაცემების დამუშავებისა და კონფიდენციალურობის წესებს."
              : "Review data handling and privacy terms."}
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
            url: `${SITE_URL}/${normalized}/delivery-returns-refunds`,
            inLanguage: normalized,
            about: {
              "@type": "Thing",
              name:
                normalized === "ka"
                  ? "მიწოდება, დაბრუნება და თანხის დაბრუნება"
                  : "Delivery, Returns, and Refunds"
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
                item: `${SITE_URL}/${normalized}/delivery-returns-refunds`
              }
            ]
          }
        ]}
      />
    </div>
  );
}
