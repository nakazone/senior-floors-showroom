"use client";

import { useState } from "react";
import type { CartItem } from "@/types";
import { trackBeginCheckout } from "@/lib/analytics";
import { getCartSubtotal } from "@/lib/cart";
import { toast } from "@/components/shared/toast-provider";

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  async function startCheckout(items: CartItem[]) {
    if (!items.length) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to start checkout");
      }

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL");
      }

      trackBeginCheckout({
        value: getCartSubtotal(items),
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          item_category: item.series,
          price: item.pricePerSqFt,
          quantity: item.sqFt,
        })),
      });

      window.location.href = data.url;
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout",
      );
    }
  }

  return { startCheckout, isLoading };
}
