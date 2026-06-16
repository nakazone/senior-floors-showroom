import { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import { findOrCreateCustomerByEmail } from "@/lib/orders";
import { parseSamplePayload } from "@/lib/samples";
import type { ShippingAddress } from "@/types";

export type CreateSampleRequestInput = {
  email: string;
  name?: string | null;
  shippingAddress: ShippingAddress;
  productIds: string[];
  customerId?: string | null;
  isPaid: boolean;
  stripeSessionId?: string | null;
};

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

export async function createSampleRequest(input: CreateSampleRequestInput) {
  const products = await prisma.product.findMany({
    where: { id: { in: input.productIds } },
    select: { id: true },
  });

  const validProductIds = products.map((product) => product.id);

  if (validProductIds.length === 0) {
    throw new Error("No valid products found for sample request");
  }

  const shippingAddress = {
    ...input.shippingAddress,
    ...(input.stripeSessionId
      ? { stripeSessionId: input.stripeSessionId }
      : {}),
    ...(input.name ? { recipientName: input.name } : {}),
  };

  return prisma.sampleRequest.create({
    data: {
      customerId: input.customerId ?? null,
      email: input.email,
      shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
      isPaid: input.isPaid,
      status: "REQUESTED",
      items: {
        create: validProductIds.map((productId) => ({ productId })),
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function createSampleRequestFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const stripeSessionId = session.id;

  const existing = await prisma.sampleRequest.findFirst({
    where: {
      shippingAddress: {
        path: ["stripeSessionId"],
        equals: stripeSessionId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  const productIds = parseSamplePayload(session.metadata?.samplePayload);
  if (productIds.length === 0) {
    throw new Error("Checkout session is missing sample metadata");
  }

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.customerEmail;

  if (!email) {
    throw new Error("Checkout session is missing customer email");
  }

  const customer =
    (session.metadata?.customerId
      ? await prisma.customer.findUnique({
          where: { id: session.metadata.customerId },
        })
      : null) ?? (await findOrCreateCustomerByEmail(email, session.metadata?.customerName));

  const shippingAddress = mapStripeAddress(
    session.collected_information?.shipping_details?.address ??
      session.customer_details?.address ??
      null,
  );

  return createSampleRequest({
    email,
    name: session.customer_details?.name ?? session.metadata?.customerName,
    shippingAddress,
    productIds,
    customerId: customer.id,
    isPaid: true,
    stripeSessionId,
  });
}

export async function getSampleRequestByStripeSession(sessionId: string) {
  try {
    return await prisma.sampleRequest.findFirst({
      where: {
        shippingAddress: {
          path: ["stripeSessionId"],
          equals: sessionId,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}
