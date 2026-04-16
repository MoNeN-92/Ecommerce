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

function buildInitialFormState(product?: any): ProductFormState {
  if (!product) {
    return emptyState;
  }

  const salePrice = Number(product.price ?? 0);
  const originalPrice =
    product.compareAtPrice && Number(product.compareAtPrice) > salePrice
      ? Number(product.compareAtPrice)
      : salePrice;

  return {
    ...product,
    price: originalPrice,
    compareAtPrice: Number(product.compareAtPrice ?? 0),
    images: product.images ?? [],
    metaKeywords: Array.isArray(product.metaKeywords) ? product.metaKeywords.join(", ") : "",
    specs: JSON.stringify(product.specs ?? {}, null, 2)
  };
}

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
  const placeholders =
    locale === "ka"
      ? {
          slug: "მაგალითად: iphone-15-pro-256gb",
          sku: "მაგალითად: APL-IP15P-256",
          nameKa: "მაგალითად: Apple iPhone 15 Pro 256GB",
          nameEn: "For example: Apple iPhone 15 Pro 256GB",
          brand: "მაგალითად: Apple",
          sellingPrice: "მაგალითად: 3999",
          stock: "მაგალითად: 12",
          keywords: "მაგალითად: iphone, apple, 256gb, smartphone",
          imageUrl: "ჩასვით სურათის სრული ბმული",
          shortDescriptionKa: "მოკლე აღწერა, რომელიც ქარდზე გამოჩნდება",
          shortDescriptionEn: "Short description shown on the product card",
          descriptionKa: "სრული აღწერა პროდუქტის შიდა გვერდისთვის",
          descriptionEn: "Full description for the inner product page",
          discountPercent: "მაგალითად: 10",
          discountAmount: "მაგალითად: 200",
          specsKey: "მაგალითად: ეკრანი",
          specsValue: "მაგალითად: 6.1-inch OLED"
        }
      : {
          slug: "For example: iphone-15-pro-256gb",
          sku: "For example: APL-IP15P-256",
          nameKa: "For example: Apple iPhone 15 Pro 256GB",
          nameEn: "For example: Apple iPhone 15 Pro 256GB",
          brand: "For example: Apple",
          sellingPrice: "For example: 3999",
          stock: "For example: 12",
          keywords: "For example: iphone, apple, 256gb, smartphone",
          imageUrl: "Paste the full image URL",
          shortDescriptionKa: "Short description in Georgian for the product card",
          shortDescriptionEn: "Short description shown on the product card",
          descriptionKa: "Full Georgian description for the product page",
          descriptionEn: "Full English description for the product page",
          discountPercent: "For example: 10",
          discountAmount: "For example: 200",
          specsKey: "For example: Display",
          specsValue: "For example: 6.1-inch OLED"
        };
  const labels =
    locale === "ka"
      ? {
          slug: "სლაგი",
          sku: "SKU",
          nameKa: "დასახელება ქართულად",
          nameEn: "დასახელება ინგლისურად",
          brand: "ბრენდი",
          category: "კატეგორია",
          price: "ფასი",
          stock: "რაოდენობა",
          keywords: "საკვანძო სიტყვები",
          shortDescriptionKa: "მოკლე აღწერა ქართულად",
          shortDescriptionEn: "მოკლე აღწერა ინგლისურად",
          descriptionKa: "სრული აღწერა ქართულად",
          descriptionEn: "სრული აღწერა ინგლისურად",
          imageUrl: "სურათის ბმული",
          discountType: "ფასდაკლების ტიპი",
          discountValue: "ფასდაკლების მნიშვნელობა",
          seoTitleKa: "SEO სათაური ქართულად",
          seoTitleEn: "SEO სათაური ინგლისურად",
          seoDescriptionKa: "SEO აღწერა ქართულად",
          seoDescriptionEn: "SEO აღწერა ინგლისურად"
        }
      : {
          slug: "Slug",
          sku: "SKU",
          nameKa: "Name in Georgian",
          nameEn: "Name in English",
          brand: "Brand",
          category: "Category",
          price: "Price",
          stock: "Quantity",
          keywords: "Keywords",
          shortDescriptionKa: "Short description in Georgian",
          shortDescriptionEn: "Short description in English",
          descriptionKa: "Full description in Georgian",
          descriptionEn: "Full description in English",
          imageUrl: "Image URL",
          discountType: "Discount type",
          discountValue: "Discount value",
          seoTitleKa: "SEO title in Georgian",
          seoTitleEn: "SEO title in English",
          seoDescriptionKa: "SEO description in Georgian",
          seoDescriptionEn: "SEO description in English"
        };
  const [form, setForm] = useState(
    buildInitialFormState(product)
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

  const pricingPreview = useMemo(() => {
    const basePrice = Number(form.price);
    const discountValue = Number(discount.value);

    if (!basePrice) {
      return {
        originalPrice: 0,
        finalPrice: 0,
        compareAtPrice: null as number | null
      };
    }

    if (!discount.enabled || !discountValue) {
      return {
        originalPrice: basePrice,
        finalPrice: basePrice,
        compareAtPrice: null as number | null
      };
    }

    if (discount.mode === "percent") {
      if (discountValue <= 0 || discountValue >= 100) {
        return {
          originalPrice: basePrice,
          finalPrice: basePrice,
          compareAtPrice: null as number | null
        };
      }

      const finalPrice = Number((basePrice * (1 - discountValue / 100)).toFixed(2));
      return {
        originalPrice: basePrice,
        finalPrice,
        compareAtPrice: finalPrice < basePrice ? basePrice : null
      };
    }

    if (discountValue <= 0 || discountValue >= basePrice) {
      return {
        originalPrice: basePrice,
        finalPrice: basePrice,
        compareAtPrice: null as number | null
      };
    }

    const finalPrice = Number((basePrice - discountValue).toFixed(2));
    return {
      originalPrice: basePrice,
      finalPrice,
      compareAtPrice: finalPrice < basePrice ? basePrice : null
    };
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

  const setPrimaryImage = (url: string) => {
    setForm((current: ProductFormState) => ({
      ...current,
      images: [url, ...current.images.filter((item: string) => item !== url)]
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
      slug: form.slug.trim(),
      sku: form.sku.trim(),
      nameKa: form.nameKa.trim() || form.nameEn.trim(),
      nameEn: form.nameEn.trim() || form.nameKa.trim(),
      shortDescriptionKa: form.shortDescriptionKa.trim() || form.shortDescriptionEn.trim() || null,
      shortDescriptionEn: form.shortDescriptionEn.trim() || form.shortDescriptionKa.trim() || null,
      descriptionKa: form.descriptionKa.trim() || form.descriptionEn.trim(),
      descriptionEn: form.descriptionEn.trim() || form.descriptionKa.trim(),
      seoTitleKa: form.seoTitleKa?.trim() || null,
      seoTitleEn: form.seoTitleEn?.trim() || null,
      seoDescriptionKa: form.seoDescriptionKa?.trim() || null,
      seoDescriptionEn: form.seoDescriptionEn?.trim() || null,
      brand: form.brand.trim(),
      price: pricingPreview.finalPrice,
      compareAtPrice: discount.enabled ? pricingPreview.compareAtPrice : null,
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

    const data = await response.json().catch(() => null);
    setLoading(false);
    if (!response.ok) {
      const validationError = data?.errors
        ? Object.values(data.errors as Record<string, string[]>).flat()[0]
        : null;
      setError(validationError ?? data?.message ?? messages.productForm.saveFailed);
      return;
    }

    window.location.href = withAdminLang("/admin/products", locale);
  };

  return (
    <div className="space-y-5 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.slug}>
          <Input
            placeholder={placeholders.slug}
            value={form.slug}
            onChange={(event) => {
              slugEditedRef.current = event.target.value.trim().length > 0;
              setForm({ ...form, slug: event.target.value });
            }}
          />
        </Field>
        <Field label={labels.sku}>
          <Input
            placeholder={placeholders.sku}
            value={form.sku}
            onChange={(event) => {
              skuEditedRef.current = event.target.value.trim().length > 0;
              setForm({ ...form, sku: event.target.value });
            }}
          />
        </Field>
        <Field label={labels.nameKa}>
          <Input placeholder={placeholders.nameKa} value={form.nameKa} onChange={(event) => setForm({ ...form, nameKa: event.target.value })} />
        </Field>
        <Field label={labels.nameEn}>
          <Input placeholder={placeholders.nameEn} value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} />
        </Field>
        <Field label={labels.brand}>
          <Input placeholder={placeholders.brand} value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
        </Field>
        <Field label={labels.category}>
          <Select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
            <option value="">{messages.productForm.category}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.nameKa} / {category.nameEn}</option>)}
          </Select>
        </Field>
        <Field label={labels.price}>
          <Input
            placeholder={placeholders.sellingPrice}
            type="number"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
          />
        </Field>
        <Field label={labels.stock}>
          <Input
            placeholder={placeholders.stock}
            type="number"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
          />
        </Field>
        <Field label={labels.keywords} className="md:col-span-2">
          <Input placeholder={placeholders.keywords} value={form.metaKeywords} onChange={(event) => setForm({ ...form, metaKeywords: event.target.value })} />
        </Field>
      </div>
      <p className="-mt-1 text-xs text-slate-500">
        {messages.productForm.skuHelp}{" "}
        {locale === "ka"
          ? "აქ შეიყვანეთ ძირითადი ფასი, ხოლო ფასდაკლება ქვემოთ დაითვლის საბოლოო გასაყიდ ფასს."
          : "Enter the base price here, then use the discount block below to calculate the final sale price."}
      </p>
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
          <Field label={labels.imageUrl} className="flex-1">
            <Input
              placeholder={placeholders.imageUrl}
              value={manualImageUrl}
              onChange={(event) => setManualImageUrl(event.target.value)}
            />
          </Field>
          <div className="self-end">
            <Button type="button" variant="secondary" onClick={addManualImage}>
              {messages.productForm.addUrl}
            </Button>
          </div>
        </div>

        {form.images.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {form.images.map((url: string, index: number) => (
              <div key={`${url}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-black/[0.06] bg-white">
                <img src={url} alt={`Product ${index + 1}`} className="h-40 w-full object-cover" />
                <div className="space-y-3 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    {index === 0 ? messages.productForm.primaryImage : `${messages.productForm.image} ${index + 1}`}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {index === 0 ? (
                      <span className="text-xs font-semibold text-emerald-700">{messages.productForm.primaryImage}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(url)}
                        className="text-xs font-semibold text-primary transition hover:text-slate-950"
                      >
                        {messages.productForm.setPrimaryImage}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                    >
                      {messages.productForm.remove}
                    </button>
                  </div>
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
            <Field label={labels.discountType}>
              <Select value={discount.mode} onChange={(event) => setDiscount((current) => ({ ...current, mode: event.target.value as "percent" | "fixed" }))}>
                <option value="percent">{messages.productForm.percent}</option>
                <option value="fixed">{messages.productForm.fixed}</option>
              </Select>
            </Field>
            <Field label={labels.discountValue}>
              <Input
                placeholder={discount.mode === "percent" ? placeholders.discountPercent : placeholders.discountAmount}
                type="number"
                value={discount.value}
                onChange={(event) => setDiscount((current) => ({ ...current, value: event.target.value }))}
              />
            </Field>
            <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm text-slate-700">
              {pricingPreview.compareAtPrice
                ? `${messages.productForm.originalPrice}: ${pricingPreview.originalPrice.toFixed(2)} GEL | ${messages.productForm.finalPrice}: ${pricingPreview.finalPrice.toFixed(2)} GEL`
                : messages.productForm.invalidDiscount}
            </div>
          </div>
        ) : null}
      </div>

      <Field label={labels.shortDescriptionKa}>
        <Textarea rows={3} placeholder={placeholders.shortDescriptionKa} value={form.shortDescriptionKa} onChange={(event) => setForm({ ...form, shortDescriptionKa: event.target.value })} />
      </Field>
      <Field label={labels.shortDescriptionEn}>
        <Textarea rows={3} placeholder={placeholders.shortDescriptionEn} value={form.shortDescriptionEn} onChange={(event) => setForm({ ...form, shortDescriptionEn: event.target.value })} />
      </Field>
      <Field label={labels.descriptionKa}>
        <Textarea rows={6} placeholder={placeholders.descriptionKa} value={form.descriptionKa} onChange={(event) => setForm({ ...form, descriptionKa: event.target.value })} />
      </Field>
      <Field label={labels.descriptionEn}>
        <Textarea rows={6} placeholder={placeholders.descriptionEn} value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.seoTitleKa}>
          <Input value={form.seoTitleKa} placeholder={placeholders.nameKa} onChange={(event) => setForm({ ...form, seoTitleKa: event.target.value })} />
        </Field>
        <Field label={labels.seoTitleEn}>
          <Input value={form.seoTitleEn} placeholder={placeholders.nameEn} onChange={(event) => setForm({ ...form, seoTitleEn: event.target.value })} />
        </Field>
        <Field label={labels.seoDescriptionKa}>
          <Textarea rows={3} placeholder={placeholders.descriptionKa} value={form.seoDescriptionKa} onChange={(event) => setForm({ ...form, seoDescriptionKa: event.target.value })} />
        </Field>
        <Field label={labels.seoDescriptionEn}>
          <Textarea rows={3} placeholder={placeholders.descriptionEn} value={form.seoDescriptionEn} onChange={(event) => setForm({ ...form, seoDescriptionEn: event.target.value })} />
        </Field>
      </div>
      <div className="space-y-3 rounded-[1.75rem] border border-black/[0.06] bg-[#faf7f2] p-5">
        <div>
          <p className="text-sm font-semibold text-slate-950">{messages.productForm.specsTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{messages.productForm.specsHelp}</p>
        </div>
        <div className="space-y-3">
          {specRows.map((row, index) => (
            <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder={placeholders.specsKey}
                value={row.key}
                onChange={(event) => updateSpecRow(index, "key", event.target.value)}
              />
              <Input
                placeholder={placeholders.specsValue}
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
