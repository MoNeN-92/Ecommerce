import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary",
        className
      )}
      {...props}
    />
  )
);

Select.displayName = "Select";
