"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages } from "@/lib/i18n/admin";
import { slugify } from "@/lib/utils";

export function CategoryCreateForm({ locale }: { locale: AdminLocale }) {
  const messages = getAdminMessages(locale);
  const [form, setForm] = useState({ slug: "", nameKa: "", nameEn: "", descriptionKa: "", descriptionEn: "", image: "", featured: false });
  const slugEditedRef = useRef(false);

  useEffect(() => {
    if (slugEditedRef.current) {
      return;
    }

    const source = form.nameEn.trim() || form.nameKa.trim();
    const nextSlug = slugify(source);

    setForm((current) => (current.slug === nextSlug ? current : { ...current, slug: nextSlug }));
  }, [form.nameEn, form.nameKa]);

  const submit = async () => {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    window.location.reload();
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder={messages.categories.slug}
          value={form.slug}
          onChange={(event) => {
            slugEditedRef.current = event.target.value.trim().length > 0;
            setForm({ ...form, slug: event.target.value });
          }}
        />
        <Input placeholder={messages.categories.nameKa} value={form.nameKa} onChange={(event) => setForm({ ...form, nameKa: event.target.value })} />
        <Input placeholder={messages.categories.nameEn} value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} />
      </div>
      <Textarea placeholder={messages.categories.descriptionKa} value={form.descriptionKa} onChange={(event) => setForm({ ...form, descriptionKa: event.target.value })} />
      <Textarea placeholder={messages.categories.descriptionEn} value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} />
      <Input placeholder={messages.categories.imageUrl} value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
      <Button onClick={submit}>{messages.categories.create}</Button>
    </div>
  );
}
