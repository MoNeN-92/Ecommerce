import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getAuthSession } from "@/lib/auth/session";
import { normalizeLocale } from "@/lib/i18n/config";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const session = await getAuthSession();

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{normalized === 'ka' ? 'შეკვეთის გაფორმება' : 'Checkout'}</h1>
      </div>
      <CheckoutForm locale={normalized} user={session?.user} />
    </div>
  );
}
