import Link from "next/link";

export function Footer({ locale }: { locale: "ka" | "en" }) {
  return (
    <footer className="mt-24 border-t border-black/[0.06] bg-[#111827] text-white">
      <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.12em] text-white">TechStore Georgia</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            {locale === "ka"
              ? "დახვეწილი ონლაინ storefront ტექნიკისა და აქსესუარებისთვის, სწრაფი მიწოდებით და სანდო სერვისით."
              : "A refined online storefront for electronics and accessories with fast delivery and dependable service."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Shop</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href={`/${locale}/products`} className="block transition hover:text-white">Products</Link>
            <Link href={`/${locale}/category/phones`} className="block transition hover:text-white">Phones</Link>
            <Link href={`/${locale}/category/headphones`} className="block transition hover:text-white">Headphones</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Company</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Tbilisi, Georgia</p>
            <p>support@teqstore.ge</p>
            <p>+995 555 00 01 11</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Service</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {locale === "ka"
              ? "სწრაფი მიწოდება, ოფიციალური გარანტია და ადამიანური მხარდაჭერა შეკვეთამდე და შეკვეთის შემდეგ."
              : "Fast delivery, official warranty, and human support before and after purchase."}
          </p>
        </div>
      </div>
    </footer>
  );
}
