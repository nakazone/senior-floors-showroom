import prisma from "@/lib/prisma";

export async function getCustomerOrders(customerId: string) {
  try {
    return await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCustomerQuotes(customerId: string) {
  try {
    return await prisma.quote.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCustomerSampleRequests(customerId: string) {
  try {
    return await prisma.sampleRequest.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCustomerWishlist(customerId: string) {
  try {
    return await prisma.wishlistItem.findMany({
      where: { customerId },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            name: true,
            pricePerSqFt: true,
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: { url: true },
            },
            variants: {
              take: 1,
              select: { hexPrimary: true, hexSecondary: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCustomerVisualizations(customerId: string) {
  try {
    return await prisma.visualization.findMany({
      where: { customerId },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export type QuoteItemsPayload = {
  products?: Array<{
    name: string;
    slug?: string;
    sqFt?: number;
    totalPrice?: number;
  }>;
};

export function parseQuoteItems(items: unknown): QuoteItemsPayload {
  if (!items || typeof items !== "object") {
    return {};
  }

  return items as QuoteItemsPayload;
}
