"use client";

import Image from "next/image";
import type { VisualizerProductOption } from "@/lib/visualizer/types";
import { cn } from "@/lib/utils";

interface ProductTexturePickerProps {
  products: VisualizerProductOption[];
  selectedId: string | null;
  onSelect: (product: VisualizerProductOption) => void;
  disabled?: boolean;
}

export function ProductTexturePicker({
  products,
  selectedId,
  onSelect,
  disabled = false,
}: ProductTexturePickerProps) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No product textures available yet. Upload a photo to preview once products are loaded.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const active = product.id === selectedId;
        return (
          <button
            key={product.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(product)}
            className={cn(
              "overflow-hidden rounded-lg border text-left transition-all duration-300",
              active
                ? "border-primary shadow-md ring-2 ring-secondary/40"
                : "border-border bg-white hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <div className="relative h-20 w-full bg-bg-light">
              <Image
                src={product.textureUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-semibold tracking-[0.12em] text-secondary uppercase">
                {product.series}
              </p>
              <p className="truncate text-sm font-medium text-text-dark">{product.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
