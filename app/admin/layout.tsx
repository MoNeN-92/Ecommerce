import type { ReactNode } from "react";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="container-shell grid gap-8 py-10 lg:grid-cols-[0.24fr_0.76fr]">
      <Suspense fallback={<div className="rounded-[2rem] border border-border bg-white p-4 shadow-soft" />}>
        <AdminNav />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}
