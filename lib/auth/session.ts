import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getSessionRole, isAdminLike } from "@/lib/auth/roles";

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

  if (!isAdminLike(getSessionRole(session))) {
    redirect("/auth/sign-in?error=admin");
  }

  return session;
}

export function isAdmin(session: Session | null) {
  return isAdminLike(getSessionRole(session));
}

export async function requireSuperAdmin() {
  const session = await requireSession();

  if (getSessionRole(session) !== "SUPER_ADMIN") {
    redirect("/admin?error=super-admin");
  }

  return session;
}

export function isSuperAdmin(session: Session | null) {
  return getSessionRole(session) === "SUPER_ADMIN";
}
