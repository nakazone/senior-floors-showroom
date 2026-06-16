import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/siteConfig";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import {
  buildCheckoutLineItems,
  checkoutRequestSchema,
  isStripeConfigured,
  serializeCartMetadata,
  type CheckoutCartItem,
} from "@/lib/stripe-checkout";
import { applyProDiscount, getProDiscountPercent, isApprovedPro } from "@/lib/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveCheckoutItems(items: CheckoutCartItem[]) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((item) => item.productId) },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      series: true,
      pricePerSqFt: true,
      boxCoverageSqFt: true,
      images: {
        orderBy: { position: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  return items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;

      const checkoutItem: CheckoutCartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        series: product.series,
        pricePerSqFt: Number(product.pricePerSqFt),
        sqFt: item.sqFt,
        boxCoverageSqFt: product.boxCoverageSqFt,
        imageUrl: product.images[0]?.url ?? item.imageUrl,
      };

      return checkoutItem;
    })
    .filter((item): item is CheckoutCartItem => item !== null);
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to continue." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let checkoutItems: CheckoutCartItem[] = [];

  try {
    checkoutItems = await resolveCheckoutItems(parsed.data.items);
  } catch {
    checkoutItems = parsed.data.items;
  }

  if (checkoutItems.length === 0) {
    return NextResponse.json(
      { error: "No valid products found in cart" },
      { status: 400 },
    );
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  let customerId: string | undefined;
  let customerEmail: string | undefined;
  let customerName: string | undefined;
  let proDiscountPercent = 0;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      customerEmail = user.email;
      customerName = user.user_metadata?.full_name ?? undefined;

      const customer = await prisma.customer.findUnique({
        where: { supabaseUserId: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          accountType: true,
          proStatus: true,
          discountPercent: true,
        },
      });

      if (customer) {
        customerId = customer.id;
        customerEmail = customer.email;
        customerName = customer.name ?? customerName;

        if (isApprovedPro(customer)) {
          proDiscountPercent = getProDiscountPercent(customer);
        }
      }
    }
  } catch {
    // Guest checkout remains available without Supabase or database access.
  }

  if (proDiscountPercent > 0) {
    checkoutItems = checkoutItems.map((item) => ({
      ...item,
      pricePerSqFt: applyProDiscount(item.pricePerSqFt, proDiscountPercent),
    }));
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: buildCheckoutLineItems(checkoutItems),
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: [
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
      ],
      metadata: {
        checkoutType: "order",
        cartPayload: serializeCartMetadata(checkoutItems),
        customerId: customerId ?? "",
        customerEmail: customerEmail ?? "",
        customerName: customerName ?? "",
        proDiscountPercent: String(proDiscountPercent),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe session was created without a redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Unable to create Stripe checkout session" },
      { status: 500 },
    );
  }
}
