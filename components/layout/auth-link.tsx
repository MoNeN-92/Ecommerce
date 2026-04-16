"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export function AuthLink({ locale, session }: { locale: "ka" | "en"; session: Session | null }) {
  if (!session) {
    return (
      <Link href="/auth/sign-in" className="rounded-full border border-black/[0.07] bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
        {locale === "ka" ? "შესვლა" : "Sign in"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className="rounded-full border border-black/[0.07] bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
    >
      {locale === "ka" ? "გასვლა" : "Sign out"}
    </button>
  );
}
