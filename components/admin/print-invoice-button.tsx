"use client";

import { Button } from "@/components/ui/button";

export function PrintInvoiceButton({ label }: { label: string }) {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
