import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/session";
import { getSessionRole } from "@/lib/auth/roles";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata("Admin");

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  const role = getSessionRole(session) ?? "ADMIN";

  return (
    <div className="admin-shell container-shell grid gap-8 py-10 lg:grid-cols-[0.24fr_0.76fr]">
      <Suspense
        fallback={<div className="rounded-[2rem] border border-border bg-white p-4 shadow-soft" />}
      >
        <AdminNav role={role} />
      </Suspense>
      <div className="admin-content">{children}</div>
    </div>
  );
}
