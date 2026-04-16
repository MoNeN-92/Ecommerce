"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages } from "@/lib/i18n/admin";
import { slugify } from "@/lib/utils";

function Field({
  label,
  children,
  className = ""
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export function CategoryCreateForm({ locale }: { locale: AdminLocale }) {
  const router = useRouter();
  const messages = getAdminMessages(locale);
  const placeholders =
    locale === "ka"
      ? {
          slug: "მაგალითად: phones",
          nameKa: "მაგალითად: ტელეფონები",
          nameEn: "მაგალითად: Phones",
          descriptionKa: "კატეგორიის მოკლე აღწერა ქართულად",
          descriptionEn: "Short category description in English",
          imageUrl: "ჩასვით სურათის სრული ბმული"
        }
      : {
          slug: "For example: phones",
          nameKa: "For example: ტელეფონები",
          nameEn: "For example: Phones",
          descriptionKa: "Short category description in Georgian",
          descriptionEn: "Short category description in English",
          imageUrl: "Paste the full image URL"
        };
  const [form, setForm] = useState({
    slug: "",
    nameKa: "",
    nameEn: "",
    descriptionKa: "",
    descriptionEn: "",
    image: "",
    featured: false
  });
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slugEditedRef = useRef(false);

  useEffect(() => {
    if (slugEditedRef.current) {
      return;
    }

    const source = form.nameEn.trim() || form.nameKa.trim();
    const nextSlug = slugify(source);

    setForm((current) => (current.slug === nextSlug ? current : { ...current, slug: nextSlug }));
  }, [form.nameEn, form.nameKa]);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", files[0]);

      const response = await fetch("/api/admin/uploads/cloudinary", {
        method: "POST",
        body
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? messages.categories.createFailed);
      }

      setForm((current) => ({
        ...current,
        image: data.url
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : messages.categories.createFailed);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addManualImage = () => {
    const normalized = manualImageUrl.trim();

    if (!normalized) {
      return;
    }

    setForm((current) => ({
      ...current,
      image: normalized
    }));
    setManualImageUrl("");
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      ...form,
      slug: form.slug.trim(),
      nameKa: form.nameKa.trim() || form.nameEn.trim(),
      nameEn: form.nameEn.trim() || form.nameKa.trim(),
      descriptionKa: form.descriptionKa.trim() || form.descriptionEn.trim() || null,
      descriptionEn: form.descriptionEn.trim() || form.descriptionKa.trim() || null,
      image: form.image.trim() || null
    };

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      const validationError = data?.errors
        ? Object.values(data.errors as Record<string, string[]>).flat()[0]
        : null;
      setError(validationError ?? data?.message ?? messages.categories.createFailed);
      return;
    }

    setForm({
      slug: "",
      nameKa: "",
      nameEn: "",
      descriptionKa: "",
      descriptionEn: "",
      image: "",
      featured: false
    });
    setManualImageUrl("");
    slugEditedRef.current = false;
    router.refresh();
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label={messages.categories.slug}>
          <Input
            placeholder={placeholders.slug}
            value={form.slug}
            onChange={(event) => {
              slugEditedRef.current = event.target.value.trim().length > 0;
              setForm({ ...form, slug: event.target.value });
            }}
          />
        </Field>
        <Field label={messages.categories.nameKa}>
          <Input placeholder={placeholders.nameKa} value={form.nameKa} onChange={(event) => setForm({ ...form, nameKa: event.target.value })} />
        </Field>
        <Field label={messages.categories.nameEn}>
          <Input placeholder={placeholders.nameEn} value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} />
        </Field>
      </div>
      <Field label={messages.categories.descriptionKa}>
        <Textarea placeholder={placeholders.descriptionKa} value={form.descriptionKa} onChange={(event) => setForm({ ...form, descriptionKa: event.target.value })} />
      </Field>
      <Field label={messages.categories.descriptionEn}>
        <Textarea placeholder={placeholders.descriptionEn} value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} />
      </Field>
      <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => setForm({ ...form, featured: event.target.checked })}
        />
        {messages.categories.featuredToggle}
      </label>

      <div className="rounded-[1.75rem] border border-black/[0.06] bg-[#faf7f2] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">{messages.categories.imageTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{messages.categories.imageDescription}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void uploadFiles(event.target.files)}
          />
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? messages.categories.uploading : messages.categories.uploadImage}
          </Button>
        </div>

        <div className="mt-4 flex gap-3">
          <Field label={messages.categories.imageUrl} className="flex-1">
            <Input
              placeholder={placeholders.imageUrl}
              value={manualImageUrl}
              onChange={(event) => setManualImageUrl(event.target.value)}
            />
          </Field>
          <div className="self-end">
            <Button type="button" variant="secondary" onClick={addManualImage}>
              {messages.categories.addUrl}
            </Button>
          </div>
        </div>

        {form.image ? (
          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-black/[0.06] bg-white">
            <img src={form.image} alt={form.nameEn || form.nameKa || "Category"} className="h-48 w-full object-cover" />
            <div className="flex items-center justify-between gap-3 p-3">
              <p className="truncate text-xs font-medium text-slate-500">{form.image}</p>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, image: "" }))}
                className="text-xs font-semibold text-red-600 transition hover:text-red-700"
              >
                {messages.categories.remove}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[1.5rem] border border-dashed border-black/[0.1] bg-white px-4 py-6 text-sm text-slate-500">
            {messages.categories.noImage}
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={loading || uploading}>
        {loading ? messages.categories.creating : messages.categories.create}
      </Button>
    </div>
  );
}
