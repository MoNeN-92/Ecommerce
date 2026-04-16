import { createManualCheckout } from "@/lib/payments/providers/manual";
import { createStripeCheckoutSession } from "@/lib/payments/providers/stripe";

export async function createPaymentSession({
  order,
  baseUrl,
  locale
}: {
  order: {
    id: string;
    orderNumber: string;
    confirmationToken: string;
    paymentProvider: string;
    items: Array<{
      nameKa: string;
      nameEn: string;
      quantity: number;
      unitPrice: { toNumber?: () => number } | number;
      image?: string | null;
    }>;
  };
  baseUrl: string;
  locale: "ka" | "en";
}) {
  if (order.paymentProvider === "stripe") {
    const stripeSession = await createStripeCheckoutSession({ order, baseUrl, locale });

    if (stripeSession?.url) {
      return stripeSession;
    }
  }

  return createManualCheckout({
    orderId: order.id,
    confirmationToken: order.confirmationToken,
    baseUrl,
    locale
  });
}
