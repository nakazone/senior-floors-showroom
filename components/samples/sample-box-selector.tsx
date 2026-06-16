"use client";

import {
  calculateSampleTotal,
  getSampleBoxPrice,
  sampleBoxOptions,
} from "@/lib/samples";
import { useSampleStore } from "@/lib/stores/sample-store";
import { formatCartCurrency } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface SampleBoxSelectorProps {
  className?: string;
}

export function SampleBoxSelector({ className }: SampleBoxSelectorProps) {
  const boxSize = useSampleStore((state) => state.boxSize);
  const setBoxSize = useSampleStore((state) => state.setBoxSize);
  const itemCount = useSampleStore((state) => state.itemCount());

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
          Choose your sample box
        </p>
        <p className="mt-1 text-sm text-text-light">
          Pick how many swatches you want to compare at home.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sampleBoxOptions.map((option) => {
          const active = boxSize === option.size;
          const price = calculateSampleTotal(1, { boxSize: option.size });

          return (
            <button
              key={option.size}
              type="button"
              onClick={() => setBoxSize(option.size)}
              className={cn(
                "relative rounded-lg border p-4 text-left transition-all duration-300",
                active
                  ? "border-primary bg-primary text-white shadow-md ring-2 ring-secondary/40"
                  : "border-border bg-white hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
              )}
            >
              {option.badge ? (
                <span
                  className={cn(
                    "absolute top-3 right-3 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    active ? "bg-secondary text-text-dark" : "bg-bg-light text-primary",
                  )}
                >
                  {option.badge}
                </span>
              ) : null}

              <p className="text-lg font-bold">{option.size} samples</p>
              <p
                className={cn(
                  "mt-1 text-sm leading-relaxed",
                  active ? "text-white/80" : "text-text-light",
                )}
              >
                {option.description}
              </p>
              <p
                className={cn(
                  "mt-3 text-base font-semibold",
                  active ? "text-secondary" : "text-text-dark",
                )}
              >
                {price <= 0 ? "Free" : formatCartCurrency(getSampleBoxPrice(option.size))}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-text-muted">
        Selected:{" "}
        <span className="font-semibold text-text-dark">
          {itemCount} / {boxSize}
        </span>{" "}
        swatches in your {boxSize}-sample box.
      </p>
    </div>
  );
}
