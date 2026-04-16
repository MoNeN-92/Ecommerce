import { Role } from "@prisma/client";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isBootstrapEnabled() {
  return process.env.ADMIN_BOOTSTRAP_ENABLED === "true";
}

export function getAdminEmailAllowlist() {
  if (!isBootstrapEnabled()) {
    return new Set<string>();
  }

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
