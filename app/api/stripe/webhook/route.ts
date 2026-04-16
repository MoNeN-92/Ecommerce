import { NextResponse } from "next/server";
import { markOrderPaidBySession } from "@/lib/services/orders";
import { getStripeClient } from "@/lib/payments/providers/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Stripe not configured" }, { status: 400 });
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      await markOrderPaidBySession(event.data.object.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid webhook" },
      { status: 400 }
    );
  }
}
