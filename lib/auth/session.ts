import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== "ADMIN") {
    redirect("/auth/sign-in?error=admin");
  }

  return session;
}

export function isAdmin(session: Session | null) {
  return session?.user.role === "ADMIN";
}
