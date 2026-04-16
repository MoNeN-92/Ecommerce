import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { toggleWishlist } from "@/lib/services/account";
import { z } from "zod";

const schema = z.object({
  productId: z.string().cuid()
});

export async function POST(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const result = await toggleWishlist(session.user.id, parsed.data.productId);
  return NextResponse.json(result);
}
