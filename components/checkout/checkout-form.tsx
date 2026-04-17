"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart-store";

export function CheckoutForm({ locale, user }: { locale: "ka" | "en"; user?: { name?: string | null; email?: string | null; phone?: string | null } | null }) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const pricing = useCartStore((state) => state.pricing);
  const guestDefaults = useMemo(
    () => ({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" }),
    [user]
  );
  const [form, setForm] = useState({
    guest: guestDefaults,
    paymentProvider: "stripe",
    installmentBank: "TBC Bank",
    installmentMonths: "12",
    shippingAddress: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      country: "Georgia",
      city: "Tbilisi",
      state: "",
      street: "",
      postalCode: "",
      label: "Home"
    },
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const method = params.get("method");
    const bank = params.get("bank");

    if (method === "stripe" || method === "cash" || method === "installment") {
      setForm((current) => ({
        ...current,
        paymentProvider: method,
        installmentBank: bank ?? current.installmentBank
      }));
      return;
    }

    if (bank) {
      setForm((current) => ({ ...current, installmentBank: bank }));
    }
  }, []);

  const setField = (path: string, value: string) => {
    setForm((current) => {
      if (path.startsWith("guest.")) {
        return { ...current, guest: { ...current.guest, [path.replace("guest.", "")]: value } };
      }
      if (path.startsWith("shippingAddress.")) {
        return {
          ...current,
          shippingAddress: {
            ...current.shippingAddress,
            [path.replace("shippingAddress.", "")]: value
          }
        };
      }
      return { ...current, [path]: value };
    });
  };

  const submit = async () => {
    if (!items.length) return;
    setLoading(true);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentProvider: form.paymentProvider,
        installmentBank: form.paymentProvider === "installment" ? form.installmentBank : undefined,
        installmentMonths: form.paymentProvider === "installment" ? Number(form.installmentMonths) : undefined,
        shippingAddress: form.shippingAddress,
        guest: user ? undefined : form.guest,
        notes: form.notes
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "Checkout failed");
      return;
    }

    clear();
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
      return;
    }

    router.push(`/${locale}/order-confirmation/${data.order.id}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
        {!user ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="Full name" value={form.guest.name} onChange={(event) => setField("guest.name", event.target.value)} />
            <Input placeholder="Email" value={form.guest.email} onChange={(event) => setField("guest.email", event.target.value)} />
            <Input placeholder="Phone" value={form.guest.phone} onChange={(event) => setField("guest.phone", event.target.value)} />
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" value={form.shippingAddress.fullName} onChange={(event) => setField("shippingAddress.fullName", event.target.value)} />
          <Input placeholder="Phone" value={form.shippingAddress.phone} onChange={(event) => setField("shippingAddress.phone", event.target.value)} />
          <Input placeholder="Email" value={form.shippingAddress.email} onChange={(event) => setField("shippingAddress.email", event.target.value)} />
          <Input placeholder="City" value={form.shippingAddress.city} onChange={(event) => setField("shippingAddress.city", event.target.value)} />
          <Input placeholder="Street" value={form.shippingAddress.street} onChange={(event) => setField("shippingAddress.street", event.target.value)} className="md:col-span-2" />
          <Input placeholder="Postal code" value={form.shippingAddress.postalCode} onChange={(event) => setField("shippingAddress.postalCode", event.target.value)} />
          <Select value={form.paymentProvider} onChange={(event) => setField("paymentProvider", event.target.value)}>
            <option value="stripe">{locale === "ka" ? "ონლაინ ბარათით გადახდა" : "Online card payment"}</option>
            <option value="installment">{locale === "ka" ? "ონლაინ განვადების მოთხოვნა" : "Online installment request"}</option>
            <option value="cash">{locale === "ka" ? "ქეში / ხელით" : "Cash / manual"}</option>
          </Select>
          {form.paymentProvider === "installment" ? (
            <>
              <Select value={form.installmentBank} onChange={(event) => setField("installmentBank", event.target.value)}>
                <option value="TBC Bank">TBC Bank</option>
                <option value="Bank of Georgia">Bank of Georgia</option>
                <option value="Credo">Credo</option>
              </Select>
              <Select value={form.installmentMonths} onChange={(event) => setField("installmentMonths", event.target.value)}>
                <option value="3">3 {locale === "ka" ? "თვე" : "months"}</option>
                <option value="6">6 {locale === "ka" ? "თვე" : "months"}</option>
                <option value="12">12 {locale === "ka" ? "თვე" : "months"}</option>
                <option value="18">18 {locale === "ka" ? "თვე" : "months"}</option>
                <option value="24">24 {locale === "ka" ? "თვე" : "months"}</option>
              </Select>
              <div className="md:col-span-2 rounded-[1.5rem] border border-[#b98b52]/20 bg-[#fbf6ee] px-4 py-4 text-sm leading-7 text-slate-600">
                {locale === "ka"
                  ? `განვადების ონლაინ მოთხოვნა შეიქმნება ${form.installmentBank}-ისთვის. დაახლოებით ${(pricing.total / Number(form.installmentMonths || 12)).toFixed(2)} GEL / თვეში.`
                  : `An online installment request will be created for ${form.installmentBank}. Estimated monthly payment: ${(pricing.total / Number(form.installmentMonths || 12)).toFixed(2)} GEL / month.`}
              </div>
            </>
          ) : null}
        </div>
        <Textarea placeholder="Order notes" rows={4} value={form.notes} onChange={(event) => setField("notes", event.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={submit} disabled={loading}>{loading ? "Processing..." : locale === "ka" ? "შეკვეთის დადასტურება" : "Place order"}</Button>
      </div>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-slate-950">{locale === "ka" ? "შეკვეთის შეჯამება" : "Order summary"}</h3>
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between"><span>Items</span><span>{pricing.count}</span></div>
          <div className="flex justify-between"><span>Subtotal</span><span>{pricing.subtotal.toFixed(2)} GEL</span></div>
          <div className="flex justify-between"><span>{locale === "ka" ? "Discount" : "Discount"}</span><span>{pricing.discount.toFixed(2)} GEL</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{pricing.shipping.toFixed(2)} GEL</span></div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-slate-950"><span>Total</span><span>{pricing.total.toFixed(2)} GEL</span></div>
        </div>
      </div>
    </div>
  );
}
