import { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import { parseCartMetadata } from "@/lib/stripe-checkout";
import type { ShippingAddress } from "@/types";

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function mapStripeAddress(
  address: Stripe.Address | null | undefined,
): ShippingAddress {
  return {
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? undefined,
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postal_code ?? "",
    country: address?.country ?? "US",
  };
}

export async function findCustomerForCheckout(customerId?: string | null) {
  if (!customerId) return null;

  return prisma.customer.findUnique({
    where: { id: customerId },
  });
}

export async function findOrCreateCustomerByEmail(
  email: string,
  name?: string | null,
) {
  const existing = await prisma.customer.findUnique({
    where: { email },
  });

  if (existing) {
    if (name && !existing.name) {
      return prisma.customer.update({
        where: { id: existing.id },
        data: { name },
      });
    }

    return existing;
  }

  return prisma.customer.create({
    data: {
      email,
      name: name ?? null,
      supabaseUserId: `guest_${crypto.randomUUID()}`,
    },
  });
}

export async function createOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const existing = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: session.id },
  });

  if (existing) {
    return existing;
  }

  const metadataItems = parseCartMetadata(session.metadata?.cartPayload);
  if (metadataItems.length === 0) {
    throw new Error("Checkout session is missing cart metadata");
  }

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail;

  if (!email) {
    throw new Error("Checkout session is missing customer email");
  }

  const metadataCustomer = await findCustomerForCheckout(
    session.metadata?.customerId,
  );

  const customer =
    metadataCustomer ??
    (await findOrCreateCustomerByEmail(
      email,
      session.customer_details?.name ?? session.metadata?.customerName,
    ));

  const products = await prisma.product.findMany({
    where: {
      id: { in: metadataItems.map((item) => item.productId) },
    },
    select: {
      id: true,
      pricePerSqFt: true,
    },
  });

  const priceByProductId = new Map(
    products.map((product) => [product.id, Number(product.pricePerSqFt)]),
  );

  const orderItems = metadataItems
    .map((item) => {
      const unitPrice = priceByProductId.get(item.productId) ?? item.unitPrice;
      const totalPrice = item.sqFt * unitPrice;

      return {
        productId: item.productId,
        sqFt: toDecimal(item.sqFt),
        unitPrice: toDecimal(unitPrice),
        totalPrice: toDecimal(totalPrice),
      };
    })
    .filter((item) => priceByProductId.has(item.productId));

  if (orderItems.length === 0) {
    throw new Error("No valid products found for checkout session");
  }

  const subtotal =
    (session.amount_subtotal ?? session.amount_total ?? 0) / 100;
  const tax = (session.total_details?.amount_tax ?? 0) / 100;
  const shipping = (session.total_details?.amount_shipping ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;

  const shippingAddress = mapStripeAddress(
    session.collected_information?.shipping_details?.address ??
      session.customer_details?.address ??
      null,
  );

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  return prisma.order.create({
    data: {
      customerId: customer.id,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId ?? null,
      status: "PROCESSING",
      subtotal: toDecimal(subtotal),
      tax: toDecimal(tax),
      shipping: toDecimal(shipping),
      total: toDecimal(total),
      shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrderByCheckoutSessionId(sessionId: string) {
  try {
    return await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}
