"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages, withAdminLang } from "@/lib/i18n/admin";
import { generateSku, slugify } from "@/lib/utils";

const emptyState = {
  slug: "",
  sku: "",
  nameKa: "",
  nameEn: "",
  shortDescriptionKa: "",
  shortDescriptionEn: "",
  descriptionKa: "",
  descriptionEn: "",
  seoTitleKa: "",
  seoTitleEn: "",
  seoDescriptionKa: "",
  seoDescriptionEn: "",
  brand: "",
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  featured: false,
  published: true,
  topProduct: false,
  installmentAvailable: true,
  categoryId: "",
  images: [] as string[],
  metaKeywords: "",
  specs: "{}"
};

type ProductFormState = typeof emptyState;
type SpecRow = { key: string; value: string };

function buildInitialDiscount(product?: any) {
  if (!product?.compareAtPrice || Number(product.compareAtPrice) <= Number(product.price)) {
    return { enabled: false, mode: "percent", value: "" };
  }

  return {
    enabled: true,
    mode: "fixed",
    value: String((Number(product.compareAtPrice) - Number(product.price)).toFixed(2))
  };
}

function buildInitialSpecs(product?: any): SpecRow[] {
  if (!product?.specs || typeof product.specs !== "object") {
    return [{ key: "", value: "" }];
  }

  const rows = Object.entries(product.specs as Record<string, string>).map(([key, value]) => ({
    key,
    value: String(value)
  }));

  return rows.length ? rows : [{ key: "", value: "" }];
}

export function ProductForm({
  categories,
  product,
  locale
}: {
  categories: Array<{ id: string; nameKa: string; nameEn: string }>;
  product?: any;
  locale: AdminLocale;
}) {
  const messages = getAdminMessages(locale);
  const [form, setForm] = useState(
    product
      ? {
          ...product,
          images: product.images,
          metaKeywords: product.metaKeywords.join(", "),
          specs: JSON.stringify(product.specs, null, 2)
        }
      : emptyState
  );
  const [discount, setDiscount] = useState(buildInitialDiscount(product));
  const [specRows, setSpecRows] = useState<SpecRow[]>(buildInitialSpecs(product));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slugEditedRef = useRef(Boolean(product?.slug));
  const skuEditedRef = useRef(Boolean(product?.sku));

  useEffect(() => {
    if (slugEditedRef.current) {
      return;
    }

    const source = form.nameEn.trim() || form.nameKa.trim();
    const nextSlug = slugify(source);

    setForm((current: ProductFormState) => (current.slug === nextSlug ? current : { ...current, slug: nextSlug }));
  }, [form.nameEn, form.nameKa]);

  useEffect(() => {
    if (skuEditedRef.current) {
      return;
    }

    const sourceName = form.nameEn.trim() || form.nameKa.trim();
    const nextSku = generateSku(form.brand, sourceName);

    setForm((current: ProductFormState) => (current.sku === nextSku ? current : { ...current, sku: nextSku }));
  }, [form.brand, form.nameEn, form.nameKa]);

  const computedCompareAtPrice = useMemo(() => {
    const salePrice = Number(form.price);
    const discountValue = Number(discount.value);

    if (!discount.enabled || !salePrice || !discountValue) {
      return null;
    }

    if (discount.mode === "percent") {
      if (discountValue <= 0 || discountValue >= 100) return null;
      return Number((salePrice / (1 - discountValue / 100)).toFixed(2));
    }

    if (discountValue <= 0) return null;
    return Number((salePrice + discountValue).toFixed(2));
  }, [discount, form.price]);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch("/api/admin/uploads/cloudinary", {
          method: "POST",
          body
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? messages.productForm.uploadFailed);
        }

        uploadedUrls.push(data.url);
      }

      setForm((current: ProductFormState) => ({
        ...current,
        images: [...current.images, ...uploadedUrls]
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : messages.productForm.uploadFailed);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addManualImage = () => {
    const normalized = manualImageUrl.trim();

    if (!normalized) return;

    setForm((current: ProductFormState) => ({
      ...current,
      images: current.images.includes(normalized) ? current.images : [...current.images, normalized]
    }));
    setManualImageUrl("");
  };

  const removeImage = (url: string) => {
    setForm((current: ProductFormState) => ({
      ...current,
      images: current.images.filter((item: string) => item !== url)
    }));
  };

  const updateSpecRow = (index: number, field: keyof SpecRow, value: string) => {
    setSpecRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  };

  const addSpecRow = () => {
    setSpecRows((current) => [...current, { key: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecRows((current) => {
      if (current.length === 1) {
        return [{ key: "", value: "" }];
      }

      return current.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    const filledSpecRows = specRows.filter((row) => row.key.trim() || row.value.trim());
    const hasIncompleteSpec = filledSpecRows.some((row) => !row.key.trim() || !row.value.trim());

    if (hasIncompleteSpec) {
      setLoading(false);
      setError(messages.productForm.incompleteSpec);
      return;
    }

    const specs = Object.fromEntries(
      filledSpecRows.map((row) => [row.key.trim(), row.value.trim()])
    );

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: discount.enabled ? computedCompareAtPrice : null,
      stock: Number(form.stock),
      images: form.images,
      metaKeywords: String(form.metaKeywords)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      specs
    };

    const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (!response.ok) {
      setError(messages.productForm.saveFailed);
      return;
    }

    window.location.href = withAdminLang("/admin/products", locale);
  };

  return (
    <div className="space-y-5 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder={messages.productForm.slug}
          value={form.slug}
          onChange={(event) => {
            slugEditedRef.current = event.target.value.trim().length > 0;
            setForm({ ...form, slug: event.target.value });
          }}
        />
        <Input
          placeholder={messages.productForm.sku}
          value={form.sku}
          onChange={(event) => {
            skuEditedRef.current = event.target.value.trim().length > 0;
            setForm({ ...form, sku: event.target.value });
          }}
        />
        <Input placeholder={messages.productForm.nameKa} value={form.nameKa} onChange={(event) => setForm({ ...form, nameKa: event.target.value })} />
        <Input placeholder={messages.productForm.nameEn} value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} />
        <Input placeholder={messages.productForm.brand} value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
        <Select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
          <option value="">{messages.productForm.category}</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.nameKa} / {category.nameEn}</option>)}
        </Select>
        <Input
          placeholder={messages.productForm.sellingPrice}
          type="number"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
        />
        <Input
          placeholder={messages.productForm.stock}
          type="number"
          value={form.stock}
          onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
        />
        <Input placeholder={messages.productForm.keywords} value={form.metaKeywords} onChange={(event) => setForm({ ...form, metaKeywords: event.target.value })} className="md:col-span-2" />
      </div>
      <p className="-mt-1 text-xs text-slate-500">{messages.productForm.skuHelp}</p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm({ ...form, featured: event.target.checked })}
          />
          {messages.productForm.featuredToggle}
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => setForm({ ...form, published: event.target.checked })}
          />
          {messages.productForm.publishedToggle}
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(form.topProduct)}
            onChange={(event) => setForm({ ...form, topProduct: event.target.checked })}
          />
          {messages.productForm.topProductToggle}
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(form.installmentAvailable)}
            onChange={(event) => setForm({ ...form, installmentAvailable: event.target.checked })}
          />
          {messages.productForm.installmentToggle}
        </label>
      </div>

      <div className="rounded-[1.75rem] border border-black/[0.06] bg-[#faf7f2] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">{messages.productForm.imagesTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{messages.productForm.imagesDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => void uploadFiles(event.target.files)}
            />
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? messages.productForm.uploading : messages.productForm.uploadImages}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Input
            placeholder="https://..."
            value={manualImageUrl}
            onChange={(event) => setManualImageUrl(event.target.value)}
          />
          <Button type="button" variant="secondary" onClick={addManualImage}>
            {messages.productForm.addUrl}
          </Button>
        </div>

        {form.images.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {form.images.map((url: string, index: number) => (
              <div key={`${url}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-black/[0.06] bg-white">
                <img src={url} alt={`Product ${index + 1}`} className="h-40 w-full object-cover" />
                <div className="flex items-center justify-between gap-3 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    {index === 0 ? messages.productForm.primaryImage : `${messages.productForm.image} ${index + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                  >
                    {messages.productForm.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[1.5rem] border border-dashed border-black/[0.1] bg-white px-4 py-6 text-sm text-slate-500">
            {messages.productForm.noImages}
          </div>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-[#b98b52]/20 bg-[#fbf6ee] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">{messages.productForm.discountTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{messages.productForm.discountDescription}</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={discount.enabled}
              onChange={(event) => setDiscount((current) => ({ ...current, enabled: event.target.checked }))}
            />
            {messages.productForm.enableDiscount}
          </label>
        </div>

        {discount.enabled ? (
          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr_1fr]">
            <Select value={discount.mode} onChange={(event) => setDiscount((current) => ({ ...current, mode: event.target.value as "percent" | "fixed" }))}>
              <option value="percent">{messages.productForm.percent}</option>
              <option value="fixed">{messages.productForm.fixed}</option>
            </Select>
            <Input
              placeholder={discount.mode === "percent" ? messages.productForm.discountPercent : messages.productForm.discountAmount}
              type="number"
              value={discount.value}
              onChange={(event) => setDiscount((current) => ({ ...current, value: event.target.value }))}
            />
            <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm text-slate-700">
              {computedCompareAtPrice
                ? `${messages.productForm.originalPrice}: ${computedCompareAtPrice.toFixed(2)} GEL`
                : messages.productForm.invalidDiscount}
            </div>
          </div>
        ) : null}
      </div>

      <Textarea rows={3} placeholder={messages.productForm.shortDescriptionKa} value={form.shortDescriptionKa} onChange={(event) => setForm({ ...form, shortDescriptionKa: event.target.value })} />
      <Textarea rows={3} placeholder={messages.productForm.shortDescriptionEn} value={form.shortDescriptionEn} onChange={(event) => setForm({ ...form, shortDescriptionEn: event.target.value })} />
      <Textarea rows={6} placeholder={messages.productForm.descriptionKa} value={form.descriptionKa} onChange={(event) => setForm({ ...form, descriptionKa: event.target.value })} />
      <Textarea rows={6} placeholder={messages.productForm.descriptionEn} value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} />
      <div className="space-y-3 rounded-[1.75rem] border border-black/[0.06] bg-[#faf7f2] p-5">
        <div>
          <p className="text-sm font-semibold text-slate-950">{messages.productForm.specsTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{messages.productForm.specsHelp}</p>
        </div>
        <div className="space-y-3">
          {specRows.map((row, index) => (
            <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder={messages.productForm.specsKey}
                value={row.key}
                onChange={(event) => updateSpecRow(index, "key", event.target.value)}
              />
              <Input
                placeholder={messages.productForm.specsValue}
                value={row.value}
                onChange={(event) => updateSpecRow(index, "value", event.target.value)}
              />
              <Button type="button" variant="secondary" onClick={() => removeSpecRow(index)}>
                {messages.productForm.remove}
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={addSpecRow}>
          {messages.productForm.addSpec}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={loading || uploading}>{loading ? messages.productForm.saving : messages.productForm.save}</Button>
    </div>
  );
}
