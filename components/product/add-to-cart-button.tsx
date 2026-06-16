"use client";

import type { Product } from "@/types";
import { useCartStore } from "@/lib/stores/cart-store";
import { trackAddToCart } from "@/lib/analytics";
import { getLineTotal } from "@/lib/cart";
import { toast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  product: Product;
  sqFt?: number;
  className?: string;
  label?: string;
  size?: "default" | "sm";
  onAdded?: () => void;
}

export function AddToCartButton({
  product,
  sqFt,
  className,
  label = "Add to Cart",
  size = "default",
  onAdded,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const coverage = sqFt ?? product.boxCoverageSqFt;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      series: product.series,
      pricePerSqFt: product.pricePerSqFt,
      sqFt: coverage,
      boxCoverageSqFt: product.boxCoverageSqFt,
      imageUrl: product.images?.[0]?.url,
    });

    trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      item_category: product.type,
      price: product.pricePerSqFt,
      quantity: coverage,
      value: getLineTotal({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        series: product.series,
        pricePerSqFt: product.pricePerSqFt,
        sqFt: coverage,
        boxCoverageSqFt: product.boxCoverageSqFt,
      }),
    });

    toast.success(`${product.name} added to cart`, {
      description: `${coverage.toFixed(1)} sq ft at $${product.pricePerSqFt.toFixed(2)}/sq ft`,
    });

    onAdded?.();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size={size}
      onClick={handleClick}
      className={className}
    >
      {label}
    </Button>
  );
}
