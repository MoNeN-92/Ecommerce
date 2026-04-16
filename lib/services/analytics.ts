import { prisma } from "@/lib/db/prisma";

export async function getAdminAnalytics() {
  const [products, orders, users, sales, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: true
      }
    })
  ]);

  return {
    products,
    orders,
    users,
    sales: Number(sales._sum.total ?? 0),
    recentOrders
  };
}
