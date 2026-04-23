import { UsersRoleTable } from "@/components/admin/users-role-table";
import { getAdminMessages, normalizeAdminLocale } from "@/lib/i18n/admin";
import { requireSuperAdmin } from "@/lib/auth/session";
import { getAdminUsers } from "@/lib/services/users";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  await requireSuperAdmin();
  const locale = normalizeAdminLocale((await searchParams)?.lang);
  const messages = getAdminMessages(locale);
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">{messages.users.title}</h1>
        <p className="mt-2 text-slate-600">{messages.users.description}</p>
      </div>
      <UsersRoleTable
        locale={locale}
        users={users.map((user) => ({
          ...user,
          createdAt: user.createdAt.toISOString()
        }))}
      />
    </div>
  );
}
