"use client";

import type { Product } from "@/types";
import { useSampleStore } from "@/lib/stores/sample-store";
import { toast } from "@/components/shared/toast-provider";
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
    const result = toggleItem(productToSelection(product));

    if (result === "added") {
      toast.success(`${product.name} added to samples`);
      return;
    }

    if (result === "removed") {
      toast.message(`${product.name} removed from samples`);
      return;
    }

    toast.error(`You can select up to ${maxSamples} samples for this box`);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => {
        const selected = items.some((item) => item.productId === product.id);
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
            className={cn(
              "sf-card cursor-pointer overflow-hidden p-2 text-left",
              selected
                ? "border-primary bg-primary text-white ring-2 ring-secondary/30"
                : "border-border bg-white text-text-dark hover:border-primary",
            )}
          >
            <div
              className="mb-2 h-16 w-full rounded-md bg-bg-light bg-cover bg-center"
              style={backgroundStyle}
            />
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="truncate text-[10px] tracking-[0.12em] uppercase opacity-80">
              {product.series}
            </p>
          </button>
        );
      })}
    </div>
  );
}
