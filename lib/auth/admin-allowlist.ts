import { Role } from "@prisma/client";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminEmailAllowlist() {
  return new Set(
    (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map(normalizeEmail)
  );
}

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmailAllowlist().has(normalizeEmail(email));
}

export function getRoleForEmail(email?: string | null) {
  return isAllowedAdminEmail(email) ? Role.ADMIN : Role.USER;
}
