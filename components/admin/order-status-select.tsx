"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages } from "@/lib/i18n/admin";

export function OrderStatusSelect({
  orderId,
  value,
  locale
}: {
  orderId: string;
  value: string;
  locale: AdminLocale;
}) {
  const messages = getAdminMessages(locale);
  const [status, setStatus] = useState(value);

  const update = async (next: string) => {
    setStatus(next);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, paymentStatus: next === "PAID" ? "PAID" : "PENDING" })
    });
  };

  return (
    <Select value={status} onChange={(event) => update(event.target.value)}>
      {["PENDING", "PROCESSING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((item) => (
        <option key={item} value={item}>{messages.status[item as keyof typeof messages.status]}</option>
      ))}
    </Select>
  );
}
