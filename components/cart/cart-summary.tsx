"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { CartItem } from "@/types";
import { formatCartCurrency, getCartSubtotal } from "@/lib/cart";

interface CartSummaryProps {
  items: CartItem[];
  checkoutHref?: string;
  onCheckoutNavigate?: () => void;
  onCheckout?: () => void | Promise<void>;
  checkoutDisabled?: boolean;
  checkoutLabel?: string;
  showStripeNote?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function CartSummary({
  items,
  checkoutHref = "/checkout",
  onCheckoutNavigate,
  onCheckout,
  checkoutDisabled = false,
  checkoutLabel = "Checkout with Stripe",
  showStripeNote = true,
  isLoading = false,
  className,
}: CartSummaryProps) {
  const subtotal = getCartSubtotal(items);

  const checkoutButtonClassName =
    "mb-2.5 flex w-full items-center justify-center gap-2 bg-stripe-purple px-4 py-[15px] text-sm font-medium tracking-wide text-white no-underline transition-colors hover:bg-[#4F48CC] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Subtotal</span>
        <span className="font-serif text-[28px] font-light text-espresso">
          {formatCartCurrency(subtotal)}
        </span>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">
        Shipping calculated at checkout. Installments available.
      </p>
      {onCheckout ? (
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutDisabled || items.length === 0 || isLoading}
          className={checkoutButtonClassName}
        >
          <Lock className="h-4 w-4" strokeWidth={1.75} />
          {isLoading ? "Redirecting..." : checkoutLabel}
        </button>
      ) : (
        <Link
          href={checkoutHref}
          className={checkoutButtonClassName}
          aria-disabled={checkoutDisabled || items.length === 0}
          onClick={(event) => {
            if (checkoutDisabled || items.length === 0) {
              event.preventDefault();
              return;
            }
            onCheckoutNavigate?.();
          }}
        >
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-bold">
            stripe
          </span>
          Checkout
        </Link>
      )}
      {showStripeNote ? (
        <p className="text-center text-[11px] tracking-wider text-muted-foreground uppercase">
          Secured by Stripe. SSL encrypted.
        </p>
      ) : null}
    </div>
  );
}
