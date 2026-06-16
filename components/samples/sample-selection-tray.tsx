"use client";

import { X } from "lucide-react";
import { useSampleStore } from "@/lib/stores/sample-store";
import { cn } from "@/lib/utils";

function swatchStyle(item: {
  hexPrimary?: string;
  hexSecondary?: string;
  imageUrl?: string;
}) {
  if (item.hexPrimary && item.hexSecondary) {
    return {
      background: `linear-gradient(135deg, ${item.hexPrimary}, ${item.hexSecondary})`,
    };
  }

  if (item.imageUrl) {
    return { backgroundImage: `url(${item.imageUrl})` };
  }

  return undefined;
}

export function SampleSelectionTray() {
  const items = useSampleStore((state) => state.items);
  const boxSize = useSampleStore((state) => state.boxSize);
  const maxSamples = useSampleStore((state) => state.maxSamples());
  const removeItem = useSampleStore((state) => state.removeItem);

  const slots = Array.from({ length: maxSamples }, (_, index) => items[index] ?? null);

  return (
    <div className="rounded-lg border border-border bg-bg-light p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
          Your selections
        </p>
        <p className="text-sm font-semibold text-text-dark">
          <span className="text-secondary">{items.length}</span>
          <span className="text-text-muted"> / {maxSamples}</span>
        </p>
      </div>

      <div
        className={cn(
          "grid gap-3",
          maxSamples === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-5",
        )}
      >
        {slots.map((item, index) => (
          <div
            key={item?.productId ?? `empty-${index}`}
            className={cn(
              "relative overflow-hidden rounded-lg border bg-white transition-all",
              item
                ? "border-primary shadow-sm"
                : "border-dashed border-border",
            )}
          >
            {item ? (
              <>
                <div
                  className="aspect-[4/3] w-full bg-bg-light bg-cover bg-center"
                  style={swatchStyle(item)}
                />
                <div className="space-y-0.5 p-2.5">
                  <p className="line-clamp-2 text-xs font-semibold leading-snug text-text-dark">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-medium text-secondary">
                    Sample {index + 1}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-3.5" />
                </button>
                <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-text-dark shadow-sm">
                  {index + 1}
                </span>
              </>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center px-2 text-center">
                <span className="flex size-7 items-center justify-center rounded-full border border-dashed border-border text-xs font-semibold text-text-muted">
                  {index + 1}
                </span>
                <p className="mt-2 text-[10px] leading-snug text-text-muted">
                  Pick a swatch
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
