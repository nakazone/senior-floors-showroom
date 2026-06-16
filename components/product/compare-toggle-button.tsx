"use client";

import type { Product } from "@/types";
import { productToCompareItem } from "@/lib/compare";
import { useCompareStore } from "@/lib/stores/compare-store";
import { toast } from "@/components/shared/toast-provider";
import { cn } from "@/lib/utils";

interface CompareToggleButtonProps {
  product: Product;
  variant?: "card" | "inline";
  className?: string;
}

export function CompareToggleButton({
  product,
  variant = "inline",
  className,
}: CompareToggleButtonProps) {
  const toggleItem = useCompareStore((state) => state.toggleItem);
  const isSelected = useCompareStore((state) =>
    state.items.some((item) => item.productId === product.id),
  );

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const result = toggleItem(productToCompareItem(product));

    if (result === "added") {
      toast.success(`${product.name} added to compare`);
      return;
    }

    if (result === "removed") {
      toast.message(`${product.name} removed from compare`);
      return;
    }

    toast.error("You can compare up to 4 floors at a time");
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "absolute right-3.5 bottom-3.5 cursor-pointer border-none px-3 py-1.5 text-[11px] font-medium tracking-wide text-espresso opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100",
          isSelected
            ? "bg-gold opacity-100"
            : "bg-bone/95 hover:bg-gold",
          className,
        )}
      >
        {isSelected ? "Added" : "+ Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "cursor-pointer border px-4 py-3 text-sm tracking-wide uppercase transition-colors",
        isSelected
          ? "border-gold bg-gold text-espresso"
          : "border-sand bg-transparent text-walnut hover:border-espresso hover:text-espresso",
        className,
      )}
    >
      {isSelected ? "In Compare" : "Add to Compare"}
    </button>
  );
}
