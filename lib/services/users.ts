import { prisma } from "@/lib/db/prisma";
import { getEffectiveRole } from "@/lib/auth/roles";

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });

  return users.map((user) => ({
    ...user,
    effectiveRole: getEffectiveRole(user.role, user.email)
  }));
}
