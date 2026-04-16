import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
