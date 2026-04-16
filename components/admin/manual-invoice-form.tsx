"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages, withAdminLang } from "@/lib/i18n/admin";
import { formatCurrency, getLocaleCurrency } from "@/lib/utils";

type ProductOption = {
  id: string;
  nameKa: string;
  nameEn: string;
  sku: string;
  stock: number;
  price: number;
};

type InvoiceLine = {
  productId: string;
  quantity: number;
};

export function ManualInvoiceForm({
  locale,
  products
}: {
  locale: AdminLocale;
  products: ProductOption[];
}) {
  const messages = getAdminMessages(locale);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentProvider, setPaymentProvider] = useState<"cash" | "bank_transfer">("cash");
  const [paymentStatus, setPaymentStatus] = useState<"PAID" | "PENDING">("PAID");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceLine[]>([{ productId: products[0]?.id ?? "", quantity: 1 }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pricedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);

          if (!product) {
            return null;
          }

          return {
            ...item,
            product,
            lineTotal: product.price * item.quantity
          };
        })
        .filter(Boolean),
    [items, products]
  );

  const subtotal = pricedItems.reduce((sum, item) => sum + item!.lineTotal, 0);

  const updateItem = (index: number, next: Partial<InvoiceLine>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)));
  };

  const addItem = () => {
    setItems((current) => [...current, { productId: products[0]?.id ?? "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const submit = async () => {
    if (!items.length || !items.some((item) => item.productId)) {
      setError(messages.orders.noItems);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        customerName,
        customerPhone,
        customerEmail,
        paymentProvider,
        paymentStatus,
        notes,
        items: items.filter((item) => item.productId)
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "Invoice creation failed");
      return;
    }

    window.location.href = withAdminLang(`/admin/orders/${data.id}/invoice`, locale);
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder={messages.orders.customerName} value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
        <Input placeholder={messages.orders.customerPhone} value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} />
        <Input placeholder={messages.orders.customerEmail} value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} />
        <Select value={paymentProvider} onChange={(event) => setPaymentProvider(event.target.value as "cash" | "bank_transfer")}>
          <option value="cash">{messages.orders.cash}</option>
          <option value="bank_transfer">{messages.orders.bankTransfer}</option>
        </Select>
        <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as "PAID" | "PENDING")}>
          <option value="PAID">{messages.orders.paid}</option>
          <option value="PENDING">{messages.orders.pending}</option>
        </Select>
      </div>

      <Textarea rows={4} placeholder={messages.orders.notes} value={notes} onChange={(event) => setNotes(event.target.value)} />

      <div className="space-y-4 rounded-[1.75rem] border border-black/[0.06] bg-[#faf7f2] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">{messages.orders.itemsTitle}</p>
          <Button type="button" variant="secondary" onClick={addItem}>
            {messages.orders.addItem}
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const selectedProduct = products.find((product) => product.id === item.productId);

            return (
              <div key={`invoice-item-${index}`} className="grid gap-3 lg:grid-cols-[1.2fr_160px_150px_auto] lg:items-center">
                <Select value={item.productId} onChange={(event) => updateItem(index, { productId: event.target.value })}>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {(locale === "ka" ? product.nameKa : product.nameEn) || product.nameEn} - {product.sku}
                    </option>
                  ))}
                </Select>
                <Input
                  type="number"
                  min={1}
                  max={selectedProduct?.stock ?? 1}
                  value={item.quantity}
                  onChange={(event) => updateItem(index, { quantity: Number(event.target.value) || 1 })}
                />
                <div className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                  {selectedProduct ? formatCurrency(selectedProduct.price * item.quantity, getLocaleCurrency(locale)) : "-"}
                </div>
                <Button type="button" variant="secondary" onClick={() => removeItem(index)}>
                  {messages.orders.removeItem}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-slate-50 p-5">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{messages.orders.subtotal}</span>
          <span className="font-semibold text-slate-950">{formatCurrency(subtotal, getLocaleCurrency(locale))}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-base font-semibold text-slate-950">
          <span>{messages.orders.total}</span>
          <span>{formatCurrency(subtotal, getLocaleCurrency(locale))}</span>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={loading}>{loading ? messages.orders.creating : messages.orders.create}</Button>
    </div>
  );
}
