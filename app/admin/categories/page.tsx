import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
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
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border bg-slate-100">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={locale === "en" ? category.nameEn : category.nameKa}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{locale === "en" ? category.nameEn : category.nameKa}</p>
                  <p className="text-sm text-slate-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{category.featured ? messages.categories.featured : messages.categories.standard}</span>
                <AdminDeleteButton
                  endpoint={`/api/admin/categories/${category.id}`}
                  confirmMessage={messages.categories.deleteConfirm}
                  label={messages.categories.delete}
                  deletingLabel={messages.categories.deleting}
                  fallbackError={messages.categories.deleteFailed}
                  className="px-4 py-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
