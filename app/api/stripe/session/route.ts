import { NextResponse } from "next/server";
import { getOrderByCheckoutSessionId } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/stripe-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Checkout session is not paid" },
        { status: 400 },
      );
    }

    const order = await getOrderByCheckoutSessionId(session.id);

    return NextResponse.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail:
        session.customer_details?.email ?? session.customer_email ?? null,
      amountTotal: (session.amount_total ?? 0) / 100,
      order: order
        ? {
            id: order.id,
            status: order.status,
            total: Number(order.total),
            items: order.items.map((item) => ({
              name: item.product.name,
              slug: item.product.slug,
              sqFt: Number(item.sqFt),
              totalPrice: Number(item.totalPrice),
            })),
          }
        : null,
    });
  } catch (error) {
    console.error("Stripe session lookup error:", error);
    return NextResponse.json(
      { error: "Unable to verify checkout session" },
      { status: 500 },
    );
  }
}
