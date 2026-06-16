"use client";

import type { Product } from "@/types";
import { Check } from "lucide-react";
import { useSampleStore } from "@/lib/stores/sample-store";
import { cn } from "@/lib/utils";

interface SamplePickerProps {
  products: Product[];
}

function productToSelection(product: Product) {
  const variant = product.variants?.[0];

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.images?.[0]?.url,
    hexPrimary: variant?.hexPrimary,
    hexSecondary: variant?.hexSecondary,
  };
}

export function SamplePicker({ products }: SamplePickerProps) {
  const items = useSampleStore((state) => state.items);
  const toggleItem = useSampleStore((state) => state.toggleItem);
  const maxSamples = useSampleStore((state) => state.maxSamples());

  function handleToggle(product: Product) {
    toggleItem(productToSelection(product));
  }

  function selectionIndex(productId: string) {
    const index = items.findIndex((item) => item.productId === productId);
    return index >= 0 ? index + 1 : null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => {
        const selectedIndex = selectionIndex(product.id);
        const selected = selectedIndex !== null;
        const variant = product.variants?.[0];
        const backgroundStyle =
          variant?.hexPrimary && variant?.hexSecondary
            ? {
                background: `linear-gradient(135deg, ${variant.hexPrimary}, ${variant.hexSecondary})`,
              }
            : product.images?.[0]?.url
              ? { backgroundImage: `url(${product.images[0].url})` }
              : undefined;

        return (
          <button
            key={product.id}
            type="button"
            onClick={() => handleToggle(product)}
            aria-pressed={selected}
            aria-label={
              selected
                ? `Remove ${product.name} from sample box`
                : `Add ${product.name} to sample box`
            }
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-lg border bg-white p-2 text-left transition-all duration-200",
              selected
                ? "border-secondary shadow-md ring-2 ring-secondary/30"
                : "border-border hover:-translate-y-0.5 hover:border-primary hover:shadow-sm",
            )}
          >
            <div className="relative mb-2">
              <div
                className="h-16 w-full rounded-md bg-bg-light bg-cover bg-center"
                style={backgroundStyle}
              />
              {selected ? (
                <>
                  <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-text-dark shadow-sm">
                    {selectedIndex}
                  </span>
                  <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                </>
              ) : null}
            </div>

            <p className="truncate text-sm font-semibold text-text-dark">{product.name}</p>
            <p className="truncate text-[10px] tracking-[0.12em] text-text-muted uppercase">
              {product.series}
            </p>
          </button>
        );
      })}

      {items.length >= maxSamples ? (
        <p className="col-span-full rounded-md border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-text-dark">
          Your {maxSamples}-sample box is full. Remove a selection below to choose a
          different swatch.
        </p>
      ) : null}
    </div>
  );
}
