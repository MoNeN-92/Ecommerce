import { prisma } from "@/lib/db/prisma";
import { addressUpsertSchema, profileSchema } from "@/lib/validators/account";

export async function getUserDashboard(userId: string) {
  const [user, orders, addresses, wishlist] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId }
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    }),
    prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })
  ]);

  return {
    user,
    orders,
    addresses,
    wishlist
  };
}

export async function updateProfile(userId: string, input: unknown) {
  const data = profileSchema.parse(input);
  return prisma.user.update({
    where: { id: userId },
    data
  });
}

export async function createAddress(userId: string, input: unknown) {
  const data = addressUpsertSchema.parse(input);

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  return prisma.address.create({
    data: {
      ...data,
      userId
    }
  });
}

export async function updateAddress(userId: string, addressId: string, input: unknown) {
  const data = addressUpsertSchema.parse(input);

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId }
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return prisma.address.update({
    where: { id: addressId },
    data
  });
}

export async function toggleWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    return { added: false };
  }

  await prisma.wishlistItem.create({
    data: {
      userId,
      productId
    }
  });

  return { added: true };
}
