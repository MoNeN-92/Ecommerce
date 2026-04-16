import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-primary",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
