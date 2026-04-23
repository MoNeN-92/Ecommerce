import Link from "next/link";
import {
  COMPANY_IDENTIFIER,
  COMPANY_NAME,
  SITE_ADDRESS_EN,
  SITE_ADDRESS_KA,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY
} from "@/lib/site";

export function Footer({ locale }: { locale: "ka" | "en" }) {
  return (
    <footer className="mt-24 border-t border-black/[0.06] bg-[#111827] text-white">
      <div className="container-shell grid gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_0.9fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.12em] text-white">{SITE_NAME}</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            {locale === "ka"
              ? "ტექნიკისა და აქსესუარების ონლაინ მაღაზია უსაფრთხო შეკვეთით, მკაფიო პირობებითა და სწრაფი მიწოდებით."
              : "An online store for electronics and accessories with secure ordering, clear terms, and fast delivery."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Shop</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href={`/${locale}/products`} className="block transition hover:text-white">
              {locale === "ka" ? "პროდუქტები" : "Products"}
            </Link>
            <Link href={`/${locale}/category/phones`} className="block transition hover:text-white">
              {locale === "ka" ? "ტელეფონები" : "Phones"}
            </Link>
            <Link href={`/${locale}/category/headphones`} className="block transition hover:text-white">
              {locale === "ka" ? "ყურსასმენები" : "Headphones"}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
            {locale === "ka" ? "კომპანია" : "Company"}
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>{COMPANY_NAME}</p>
            <p>{locale === "ka" ? `საიდენტიფიკაციო კოდი: ${COMPANY_IDENTIFIER}` : `Identification code: ${COMPANY_IDENTIFIER}`}</p>
            <p>{locale === "ka" ? SITE_ADDRESS_KA : SITE_ADDRESS_EN}</p>
            <p>{SITE_EMAIL}</p>
            <p>{SITE_PHONE_DISPLAY}</p>
            <Link href={`/${locale}/about-us`} className="block transition hover:text-white">
              {locale === "ka" ? "კომპანიის შესახებ" : "About Us"}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
            {locale === "ka" ? "სერვისი" : "Service"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {locale === "ka"
              ? "თბილისში კურიერი უფასოა და შესაძლებელია კურიერთან გადახდაც. რეგიონებში კი წინასწარი გადახდის შემდეგ ნივთი იმავე დღეს იგზავნება."
              : "Courier delivery in Tbilisi is free and payment to the courier is available. For regional shipments, the item is dispatched the same day after advance payment."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
            {locale === "ka" ? "იურიდიული" : "Legal"}
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href={`/${locale}/about-us`} className="block transition hover:text-white">
              {locale === "ka" ? "კომპანიის შესახებ" : "About Us"}
            </Link>
            <Link href={`/${locale}/privacy-policy`} className="block transition hover:text-white">
              {locale === "ka" ? "კონფიდენციალურობა" : "Privacy Policy"}
            </Link>
            <Link href={`/${locale}/terms-of-service`} className="block transition hover:text-white">
              {locale === "ka" ? "მომსახურების პირობები" : "Terms of Service"}
            </Link>
            <Link href={`/${locale}/delivery-returns-refunds`} className="block transition hover:text-white">
              {locale === "ka" ? "მიწოდება და დაბრუნება" : "Delivery and Returns"}
            </Link>
            <Link href={`/${locale}/faq`} className="block transition hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
