import { z } from "zod";
import type Stripe from "stripe";
import type { CartItem } from "@/types";
import { getLineTotal } from "@/lib/cart";

export const checkoutCartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  series: z.string().optional().default(""),
  pricePerSqFt: z.number().positive(),
  sqFt: z.number().positive(),
  boxCoverageSqFt: z.number().positive().optional().default(20),
  imageUrl: z.string().url().optional(),
});

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutCartItemSchema).min(1).max(20),
});

export type CheckoutCartItem = z.infer<typeof checkoutCartItemSchema>;

/** Demo product used for $1 Stripe checkout tests — qualifies for free shipping. */
export const FREE_SHIPPING_PRODUCT_SLUG = "demo-one-dollar-checkout";

export function qualifiesForFreeShipping(items: CheckoutCartItem[]) {
  return (
    items.length > 0 &&
    items.every((item) => item.slug === FREE_SHIPPING_PRODUCT_SLUG)
  );
}

export function buildShippingOptions(
  items: CheckoutCartItem[],
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  if (qualifiesForFreeShipping(items)) {
    return [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free test delivery",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 3 },
          },
        },
      },
    ];
  }

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: 14900,
          currency: "usd",
        },
        display_name: "Freight delivery",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 5 },
          maximum: { unit: "business_day", value: 10 },
        },
      },
    },
  ];
}

export type StripeCartMetaItem = {
  p: string;
  s: number;
  u: number;
};

export function serializeCartMetadata(items: CheckoutCartItem[]) {
  const payload: StripeCartMetaItem[] = items.map((item) => ({
    p: item.productId,
    s: item.sqFt,
    u: item.pricePerSqFt,
  }));

  return JSON.stringify(payload);
}

export function parseCartMetadata(raw: string | null | undefined) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StripeCartMetaItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => ({
        productId: entry.p,
        sqFt: entry.s,
        unitPrice: entry.u,
      }))
      .filter(
        (entry) =>
          entry.productId &&
          entry.sqFt > 0 &&
          entry.unitPrice > 0,
      );
  } catch {
    return [];
  }
}

export function buildCheckoutLineItems(
  items: CheckoutCartItem[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(getLineTotal(item) * 100),
      product_data: {
        name: item.name,
        description: `${item.series || "Senior Floors"} | ${item.sqFt.toFixed(1)} sq ft`,
        images: item.imageUrl ? [item.imageUrl] : undefined,
        metadata: {
          productId: item.productId,
          slug: item.slug,
        },
      },
    },
  }));
}

export function toCheckoutCartItem(item: CartItem): CheckoutCartItem {
  return {
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    series: item.series,
    pricePerSqFt: item.pricePerSqFt,
    sqFt: item.sqFt,
    boxCoverageSqFt: item.boxCoverageSqFt,
    imageUrl: item.imageUrl,
  };
}

export function getStripePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    process.env.STRIPE_PUBLISHABLE_KEY ??
    ""
  );
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && getStripePublishableKey());
}

export function getStripeConfigError() {
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!getStripePublishableKey()) {
    missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  }
  if (missing.length === 0) return null;
  return `Stripe is not configured. Add ${missing.join(" and ")} to continue.`;
}
