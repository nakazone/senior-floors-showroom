import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/siteConfig";
import {
  calculateSampleTotal,
  getSampleBoxPrice,
  MAX_SAMPLE_BOX_SIZE,
  serializeSamplePayload,
} from "@/lib/samples";
import { getStripe } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/stripe-checkout";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const paidSampleCheckoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  productIds: z.array(z.string().min(1)).min(1).max(MAX_SAMPLE_BOX_SIZE),
  boxSize: z.union([z.literal(3), z.literal(5)]).default(3),
  freeWithOrder: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured for paid samples." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = paidSampleCheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sample checkout payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.productIds.length > data.boxSize) {
    return NextResponse.json(
      { error: `You can only order up to ${data.boxSize} samples in this box.` },
      { status: 400 },
    );
  }

  const total = calculateSampleTotal(data.productIds.length, {
    freeWithOrder: data.freeWithOrder,
    boxSize: data.boxSize,
  });

  if (total <= 0) {
    return NextResponse.json(
      { error: "These samples qualify for free delivery. Use the sample request form." },
      { status: 400 },
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: data.productIds } },
    select: { id: true, name: true, slug: true },
  });

  if (products.length === 0) {
    return NextResponse.json({ error: "No valid products selected" }, { status: 400 });
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  let customerId: string | undefined;
  let customerEmail = data.email;
  let customerName = data.name;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      customerEmail = user.email;
      customerName = user.user_metadata?.full_name ?? customerName;

      const customer = await prisma.customer.findUnique({
        where: { supabaseUserId: user.id },
        select: { id: true, email: true, name: true },
      });

      if (customer) {
        customerId = customer.id;
        customerEmail = customer.email;
        customerName = customer.name ?? customerName;
      }
    }
  } catch {
    // Guest checkout remains available.
  }

  const boxPrice = getSampleBoxPrice(data.boxSize);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(boxPrice * 100),
            product_data: {
              name: `${data.boxSize}-Sample Box`,
              description: `${products.length} flooring swatch${products.length === 1 ? "" : "es"}: ${products.map((product) => product.name).join(", ")}`,
              metadata: {
                boxSize: String(data.boxSize),
                productIds: products.map((product) => product.id).join(","),
              },
            },
          },
        },
      ],
      success_url: `${siteUrl}/samples/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/samples`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        checkoutType: "samples",
        samplePayload: serializeSamplePayload(
          products.map((product) => product.id),
          data.boxSize,
        ),
        boxSize: String(data.boxSize),
        customerId: customerId ?? "",
        customerEmail,
        customerName: customerName ?? "",
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
    console.error("Stripe sample checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create sample checkout session" },
      { status: 500 },
    );
  }
}
