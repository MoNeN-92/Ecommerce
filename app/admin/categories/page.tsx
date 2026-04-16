import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.categories.title}</h1>
        <p className="mt-2 text-slate-600">{messages.categories.description}</p>
      </div>
      <CategoryCreateForm locale={locale} />
      <Card>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
              <div>
                <p className="font-semibold text-slate-950">{locale === "en" ? category.nameEn : category.nameKa}</p>
                <p className="text-sm text-slate-500">/{category.slug}</p>
              </div>
              <span className="text-sm text-slate-500">{category.featured ? messages.categories.featured : messages.categories.standard}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
