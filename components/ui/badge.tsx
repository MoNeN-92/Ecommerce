import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-black/[0.06] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700",
        className
      )}
    >
      {children}
    </span>
  );
}
