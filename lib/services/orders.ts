import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { Locale } from "@/lib/i18n/config";
import { createPaymentSession } from "@/lib/payments";
import { manualInvoiceSchema } from "@/lib/validators/admin-orders";
import { checkoutSchema } from "@/lib/validators/checkout";
import { generateOrderNumber } from "@/lib/utils";

function decimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

export async function priceCartItems(items: { productId: string; quantity: number }[]) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((item) => item.productId) },
      published: true
    },
    include: {
      category: true
    }
  });

  const lines = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        return null;
      }

      const quantity = Math.min(item.quantity, product.stock);
      return {
        productId: product.id,
        slug: product.slug,
        quantity,
        name: product.nameKa,
        image: product.images[0] ?? "https://placehold.co/400x400?text=Product",
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        stock: product.stock
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, line) => sum + line!.price * line!.quantity, 0);
  const discount = lines.reduce((sum, line) => {
    const compareAt = line!.compareAtPrice ?? line!.price;
    return sum + Math.max(compareAt - line!.price, 0) * line!.quantity;
  }, 0);
  const shipping = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shipping;

  return {
    items: lines,
    pricing: {
      subtotal,
      discount,
      shipping,
      total,
      count: lines.reduce((count, line) => count + line!.quantity, 0)
    }
  };
}

export async function createOrder(input: unknown, userId?: string | null) {
  const parsed = checkoutSchema.parse(input);
  const priced = await priceCartItems(parsed.items);

  if (!priced.items.length) {
    throw new Error("Cart is empty");
  }

  const normalizedItems = priced.items.filter(Boolean) as NonNullable<(typeof priced.items)[number]>[];
  const confirmationEmail = parsed.guest?.email || parsed.shippingAddress.email || "";
  const normalizedNotes = [
    parsed.notes,
    parsed.paymentProvider === "installment"
      ? `Installment request: ${parsed.installmentBank ?? "bank not selected"}, ${parsed.installmentMonths ?? 12} months`
      : null
  ]
    .filter(Boolean)
    .join("\n");

  const order = await prisma.$transaction(async (tx) => {
    const shippingAddress = await tx.address.create({
      data: {
        ...parsed.shippingAddress,
        email: parsed.shippingAddress.email || parsed.guest?.email,
        userId: userId ?? null
      }
    });

    const billingAddress = parsed.billingAddress
      ? await tx.address.create({
          data: {
            ...parsed.billingAddress,
            email: parsed.billingAddress.email || parsed.guest?.email,
            userId: userId ?? null
          }
        })
      : shippingAddress;

    const products = await tx.product.findMany({
      where: { id: { in: normalizedItems.map((line) => line.productId) } }
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId ?? null,
        guestName: parsed.guest?.name,
        guestEmail: parsed.guest?.email,
        guestPhone: parsed.guest?.phone,
        locale: parsed.locale,
        currency: "GEL",
        subtotal: decimal(priced.pricing.subtotal),
        discount: decimal(priced.pricing.discount),
        shipping: decimal(priced.pricing.shipping),
        total: decimal(priced.pricing.total),
        paymentProvider: parsed.paymentProvider,
        paymentStatus: PaymentStatus.PENDING,
        notes: normalizedNotes || undefined,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        items: {
          create: normalizedItems.map((line) => {
            const product = productMap.get(line.productId)!;
            return {
              product: { connect: { id: line.productId } },
              nameKa: product.nameKa,
              nameEn: product.nameEn,
              slug: product.slug,
              sku: product.sku,
              unitPrice: decimal(line.price),
              compareAtPrice: line.compareAtPrice ? decimal(line.compareAtPrice) : null,
              quantity: line.quantity,
              image: line.image,
              specsSnapshot: (product.specs ?? {}) as Prisma.InputJsonValue
            };
          })
        }
      }
    });

    await Promise.all(
      normalizedItems.map((line) =>
        tx.product.update({
          where: { id: line.productId },
          data: {
            stock: {
              decrement: line.quantity
            }
          }
        })
      )
    );

    return createdOrder;
  });

  const orderWithItems = await prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true
    }
  });

  const paymentSession = await createPaymentSession({
    order: {
      id: orderWithItems.id,
      orderNumber: orderWithItems.orderNumber,
      paymentProvider: orderWithItems.paymentProvider,
      items: orderWithItems.items.map((item) => ({
        nameKa: item.nameKa,
        nameEn: item.nameEn,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        image: item.image
      }))
    },
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    locale: parsed.locale as Locale
  });

  if (paymentSession.externalId) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: paymentSession.externalId,
        paymentIntentId: paymentSession.externalId
      }
    });
  }

  await sendOrderConfirmationEmail({
    to: confirmationEmail,
    orderNumber: order.orderNumber,
    locale: parsed.locale as Locale
  });

  return {
    order: orderWithItems,
    paymentUrl: paymentSession.url
  };
}

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shippingAddress: true
    }
  });
}

export async function getOrderById(orderId: string, userId?: string | null) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      ...(userId ? { userId } : {})
    },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true
    }
  });
}

export async function updateOrderStatus(orderId: string, input: { status: string; paymentStatus?: string }) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: input.status as OrderStatus,
      ...(input.paymentStatus ? { paymentStatus: input.paymentStatus as PaymentStatus } : {})
    }
  });
}

export async function createManualInvoice(input: unknown) {
  const parsed = manualInvoiceSchema.parse(input);

  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: { in: parsed.items.map((item) => item.productId) }
      }
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = parsed.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.nameEn}`);
      }

      return { item, product };
    });

    const subtotal = normalizedItems.reduce(
      (sum, entry) => sum + Number(entry.product.price) * entry.item.quantity,
      0
    );
    const discount = normalizedItems.reduce((sum, entry) => {
      const compareAt = entry.product.compareAtPrice ? Number(entry.product.compareAtPrice) : Number(entry.product.price);
      return sum + Math.max(compareAt - Number(entry.product.price), 0) * entry.item.quantity;
    }, 0);
    const total = subtotal;

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        guestName: parsed.customerName,
        guestEmail: parsed.customerEmail || undefined,
        guestPhone: parsed.customerPhone || undefined,
        locale: parsed.locale,
        currency: "GEL",
        subtotal: decimal(subtotal),
        discount: decimal(discount),
        shipping: decimal(0),
        total: decimal(total),
        paymentProvider: parsed.paymentProvider,
        paymentStatus: parsed.paymentStatus as PaymentStatus,
        status: parsed.paymentStatus === "PAID" ? OrderStatus.PAID : OrderStatus.PENDING,
        notes: parsed.notes || undefined,
        items: {
          create: normalizedItems.map(({ item, product }) => ({
            product: { connect: { id: product.id } },
            nameKa: product.nameKa,
            nameEn: product.nameEn,
            slug: product.slug,
            sku: product.sku,
            unitPrice: product.price,
            compareAtPrice: product.compareAtPrice,
            quantity: item.quantity,
            image: product.images[0],
            specsSnapshot: (product.specs ?? {}) as Prisma.InputJsonValue
          }))
        }
      }
    });

    await Promise.all(
      normalizedItems.map(({ item, product }) =>
        tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      )
    );

    return createdOrder;
  });

  return prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: {
      items: true
    }
  });
}

export async function getAdminOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true
    }
  });
}

export async function markOrderPaidBySession(sessionId: string) {
  return prisma.order.updateMany({
    where: { stripeSessionId: sessionId },
    data: {
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.PAID
    }
  });
}
