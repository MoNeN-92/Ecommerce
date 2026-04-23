import type { Role } from "@prisma/client";
import type { Session } from "next-auth";

export type AppRole = Role | "SUPER_ADMIN";

export const SUPER_ADMIN_EMAIL = "ika.tatishvili@gmail.com";

export function isSuperAdminEmail(email?: string | null) {
  return email?.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function getEffectiveRole(role: Role, email?: string | null): AppRole {
  return isSuperAdminEmail(email) ? "SUPER_ADMIN" : role;
}

export function isAdminLike(role: AppRole | null | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function getSessionRole(session: Session | null): AppRole | null {
  if (!session?.user) {
    return null;
  }

  return getEffectiveRole(session.user.role, session.user.email);
}
