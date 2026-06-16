"use client";

import { useState } from "react";
import { Package, Truck } from "lucide-react";
import {
  calculateSampleTotal,
  getSampleBoxPrice,
} from "@/lib/samples";
import { useSampleStore } from "@/lib/stores/sample-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatCartCurrency } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SampleOrderForm } from "@/components/samples/sample-order-form";

interface SampleShippingDialogProps {
  className?: string;
}

export function SampleShippingDialog({ className }: SampleShippingDialogProps) {
  const [open, setOpen] = useState(false);
  const items = useSampleStore((state) => state.items);
  const boxSize = useSampleStore((state) => state.boxSize);
  const maxSamples = useSampleStore((state) => state.maxSamples());
  const cartItems = useCartStore((state) => state.items);

  const freeWithOrder = cartItems.length > 0;
  const total = calculateSampleTotal(items.length, { freeWithOrder, boxSize });
  const isFree = total <= 0;
  const hasSelection = items.length > 0;
  const isComplete = items.length === maxSamples;

  return (
    <>
      <div
        className={cn(
          "rounded-lg border border-border bg-white p-5 shadow-md",
          className,
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
              Your sample box
            </p>
            <p className="mt-1 text-lg font-bold text-text-dark">
              {boxSize}-sample box:{" "}
              <span className="text-secondary">
                {items.length} / {maxSamples}
              </span>
            </p>
            <p className="mt-1 text-sm text-text-light">
              {hasSelection
                ? isFree
                  ? "Free shipping, delivered in 2-4 business days"
                  : `${formatCartCurrency(total)} - address collected at checkout`
                : `Select up to ${maxSamples} swatches above`}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <p className="text-2xl font-bold text-text-dark">
              {isFree ? "Free" : formatCartCurrency(total)}
            </p>
            {!isFree && !freeWithOrder ? (
              <p className="text-xs text-text-muted">
                or free with flooring in cart
              </p>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={!hasSelection}
          onClick={() => setOpen(true)}
          className="mt-5 w-full py-6"
        >
          <Truck className="size-4" />
          {hasSelection
            ? isComplete
              ? "Enter shipping details"
              : `Continue with ${items.length} sample${items.length === 1 ? "" : "s"}`
            : "Select samples to continue"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90vh,820px)] overflow-y-auto border-border bg-white p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-text-dark">
                  Shipping details
                </DialogTitle>
                <DialogDescription className="mt-1 text-text-light">
                  {boxSize}-sample box, {items.length} swatch
                  {items.length === 1 ? "" : "es"},{" "}
                  {isFree
                    ? "Free"
                    : formatCartCurrency(getSampleBoxPrice(boxSize))}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5">
            <SampleOrderForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
