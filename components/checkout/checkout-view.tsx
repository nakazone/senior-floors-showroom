"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { getCartSqFtTotal } from "@/lib/cart";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { Button } from "@/components/ui/button";

export function CheckoutView() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { startCheckout, isLoading } = useStripeCheckout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[320px] animate-pulse rounded-none bg-cream/60" />
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-sand bg-white p-10">
        <CartEmptyState />
      </div>
    );
  }

  const totalSqFt = getCartSqFtTotal(items);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <section className="border border-sand bg-white p-6 md:p-8">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-cream pb-4">
          <div>
            <h2 className="font-serif text-2xl font-light text-espresso">
              Order summary
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} product{items.length === 1 ? "" : "s"} |{" "}
              {totalSqFt.toFixed(1)} sq ft total
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={clearCart}
            className="rounded-none border-sand text-walnut hover:border-espresso hover:text-espresso"
          >
            Clear cart
          </Button>
        </div>

        <ul className="space-y-5">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </ul>

        <Link
          href="/shop"
          className="mt-8 inline-block text-sm text-walnut underline"
        >
          Continue shopping
        </Link>
      </section>

      <aside className="h-fit border border-sand bg-bone p-6 md:p-8">
        <h2 className="mb-6 font-serif text-2xl font-light text-espresso">
          Checkout
        </h2>
        <CartSummary
          items={items}
          onCheckout={() => startCheckout(items)}
          isLoading={isLoading}
          checkoutDisabled={isLoading}
          checkoutLabel="Checkout with Stripe"
        />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Apple Pay and Google Pay are available through Stripe Checkout when
          enabled on your Stripe account.
        </p>
      </aside>
    </div>
  );
}
