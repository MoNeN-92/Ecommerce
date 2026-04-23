"use client";

import { useState } from "react";
import type { Role } from "@prisma/client";
import type { AdminLocale } from "@/lib/i18n/admin";
import { getAdminMessages } from "@/lib/i18n/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: Role;
  effectiveRole: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
};

export function UsersRoleTable({
  locale,
  users
}: {
  locale: AdminLocale;
  users: UserRow[];
}) {
  const messages = getAdminMessages(locale);
  const [roles, setRoles] = useState<Record<string, Role>>(
    Object.fromEntries(users.map((user) => [user.id, user.role]))
  );
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveRole = async (userId: string) => {
    setLoadingId(userId);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roles[userId] })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? messages.users.updateFailed);
      }

      setMessage(messages.users.updated);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : messages.users.updateFailed);
    } finally {
      setLoadingId(null);
    }
  };

  const resetPassword = async (userId: string) => {
    const nextPassword = passwords[userId]?.trim() ?? "";

    if (nextPassword.length < 8) {
      setMessage(null);
      setError(messages.users.passwordTooShort);
      return;
    }

    setLoadingId(`password:${userId}`);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: nextPassword })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? messages.users.updateFailed);
      }

      setPasswords((current) => ({ ...current, [userId]: "" }));
      setMessage(messages.users.passwordUpdated);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : messages.users.updateFailed);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr className="border-b border-border">
              <th className="px-3 py-3">{messages.users.name}</th>
              <th className="px-3 py-3">{messages.users.email}</th>
              <th className="px-3 py-3">{messages.users.phone}</th>
              <th className="px-3 py-3">{messages.users.createdAt}</th>
              <th className="px-3 py-3">{messages.users.effectiveRole}</th>
              <th className="px-3 py-3">{messages.users.role}</th>
              <th className="px-3 py-3">{messages.users.newPassword}</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSuperAdmin = user.effectiveRole === "SUPER_ADMIN";

              return (
                <tr key={user.id} className="border-b border-border/70 align-top">
                  <td className="px-3 py-4 font-medium text-slate-950">{user.name || "-"}</td>
                  <td className="px-3 py-4 text-slate-700">{user.email}</td>
                  <td className="px-3 py-4 text-slate-700">{user.phone || "-"}</td>
                  <td className="px-3 py-4 text-slate-700">
                    {new Date(user.createdAt).toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US")}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isSuperAdmin
                          ? "bg-amber-100 text-amber-800"
                          : user.effectiveRole === "ADMIN"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.effectiveRole}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {isSuperAdmin ? (
                      <span className="text-xs font-semibold text-slate-500">{messages.users.superAdmin}</span>
                    ) : (
                      <Select
                        value={roles[user.id]}
                        onChange={(event) =>
                          setRoles((current) => ({ ...current, [user.id]: event.target.value as Role }))
                        }
                        className="min-w-[140px]"
                      >
                        <option value="USER">{messages.users.user}</option>
                        <option value="ADMIN">{messages.users.admin}</option>
                      </Select>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {!isSuperAdmin ? (
                      <Input
                        type="password"
                        value={passwords[user.id] ?? ""}
                        placeholder={messages.users.passwordPlaceholder}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, [user.id]: event.target.value }))
                        }
                        className="min-w-[180px]"
                      />
                    ) : null}
                  </td>
                  <td className="px-3 py-4">
                    {!isSuperAdmin ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="secondary"
                          onClick={() => void saveRole(user.id)}
                          disabled={loadingId === user.id || loadingId === `password:${user.id}`}
                        >
                          {loadingId === user.id ? messages.users.saving : messages.users.save}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => void resetPassword(user.id)}
                          disabled={loadingId === user.id || loadingId === `password:${user.id}`}
                        >
                          {loadingId === `password:${user.id}` ? messages.users.resettingPassword : messages.users.resetPassword}
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
