import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createOrder } from "@/lib/services/orders";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = rateLimit(`checkout:${ip}`, 30);

  if (!limited.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const session = await getAuthSession();
  const body = await request.json();

  try {
    const result = await createOrder(body, session?.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Checkout failed" },
      { status: 400 }
    );
  }
}
