import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil"
    })
  : null;

export async function createStripeCheckoutSession({
  order,
  baseUrl,
  locale
}: {
  order: {
    id: string;
    orderNumber: string;
    confirmationToken: string;
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
  if (!stripe) {
    return null;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/${locale}/order-confirmation/${order.id}?session_id={CHECKOUT_SESSION_ID}&token=${order.confirmationToken}`,
    cancel_url: `${baseUrl}/${locale}/checkout?cancelled=1`,
    payment_method_types: ["card"],
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber
    },
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "gel",
        unit_amount: Math.round(
          (typeof item.unitPrice === "number" ? item.unitPrice : item.unitPrice.toNumber?.() ?? 0) * 100
        ),
        product_data: {
          name: locale === "ka" ? item.nameKa : item.nameEn,
          images: item.image ? [item.image] : undefined
        }
      }
    }))
  });

  return {
    url: session.url,
    externalId: session.id
  };
}

export function getStripeClient() {
  return stripe;
}
