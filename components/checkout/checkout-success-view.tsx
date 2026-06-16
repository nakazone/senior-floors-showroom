"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { trackPurchase } from "@/lib/analytics";
import { formatCartCurrency } from "@/lib/cart";

interface CheckoutSuccessViewProps {
  sessionId: string;
}

type SessionSummary = {
  sessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  order: {
    id: string;
    status: string;
    total: number;
    items: Array<{
      name: string;
      slug: string;
      sqFt: number;
      totalPrice: number;
    }>;
  } | null;
};

export function CheckoutSuccessView({ sessionId }: CheckoutSuccessViewProps) {
  const clearCart = useCartStore((state) => state.clearCart);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const trackedPurchaseRef = useRef(false);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await response.json()) as SessionSummary & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to verify payment");
        }

        if (!cancelled) {
          setSummary(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to verify payment",
          );
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!summary || trackedPurchaseRef.current) return;

    trackedPurchaseRef.current = true;
    trackPurchase({
      transactionId: summary.order?.id ?? summary.sessionId,
      value: summary.amountTotal,
      items:
        summary.order?.items.map((item) => ({
          item_id: item.slug,
          item_name: item.name,
          price: item.totalPrice / Math.max(item.sqFt, 1),
          quantity: item.sqFt,
        })) ?? [],
    });
  }, [summary]);

  if (error) {
    return (
      <div className="border border-sand bg-white p-10 text-center">
        <h2 className="mb-3 font-serif text-3xl font-light text-espresso">
          Payment received
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Your payment went through, but we could not load the order details yet.
          Check your email for confirmation.
        </p>
        <Link
          href="/account/orders"
          className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
        >
          View orders
        </Link>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-[280px] animate-pulse rounded-none bg-cream/60" />
    );
  }

  return (
    <div className="grid gap-8 border border-sand bg-white p-8 lg:grid-cols-[1fr_320px]">
      <div>
        <span className="eyebrow">Confirmed</span>
        <h2 className="display-heading mb-4">
          Thank you for your <em>order</em>
        </h2>
        <p className="mb-6 max-w-xl text-walnut">
          {summary.customerEmail
            ? `A confirmation email will be sent to ${summary.customerEmail}.`
            : "Your flooring order is being prepared for fulfillment."}
        </p>

        {summary.order?.items.length ? (
          <ul className="space-y-4 border-t border-cream pt-6">
            {summary.order.items.map((item) => (
              <li
                key={`${item.slug}-${item.sqFt}`}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-serif text-lg text-espresso no-underline hover:text-walnut"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.sqFt.toFixed(1)} sq ft
                  </p>
                </div>
                <p className="font-serif text-lg text-espresso">
                  {formatCartCurrency(item.totalPrice)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <aside className="h-fit bg-bone p-6">
        <p className="mb-2 text-sm text-muted-foreground">Order total</p>
        <p className="mb-6 font-serif text-4xl font-light text-espresso">
          {formatCartCurrency(summary.amountTotal)}
        </p>
        <p className="mb-6 text-xs text-muted-foreground">
          Reference: {summary.sessionId}
        </p>
        <Link
          href="/shop"
          className="mb-3 inline-block w-full bg-espresso px-4 py-3 text-center text-sm font-medium tracking-wide text-bone uppercase no-underline"
        >
          Continue shopping
        </Link>
        <Link
          href="/account/orders"
          className="inline-block w-full border border-espresso px-4 py-3 text-center text-sm tracking-wide text-espresso uppercase no-underline"
        >
          View orders
        </Link>
      </aside>
    </div>
  );
}
