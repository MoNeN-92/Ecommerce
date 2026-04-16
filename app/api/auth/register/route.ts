import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getRoleForEmail } from "@/lib/auth/admin-allowlist";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = rateLimit(`register:${ip}`, 10);

  if (!limited.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existing) {
    return NextResponse.json({ message: "Email already exists" }, { status: 409 });
  }

  const password = await hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      phone: parsed.data.phone,
      locale: parsed.data.locale,
      role: getRoleForEmail(parsed.data.email)
    }
  });

  return NextResponse.json({
    id: user.id,
    email: user.email
  });
}
