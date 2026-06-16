"use client";

import Link from "next/link";
import type { CartItem } from "@/types";
import { formatCartCurrency, getLineTotal } from "@/lib/cart";
import { useCartStore } from "@/lib/stores/cart-store";

interface CartLineItemProps {
  item: CartItem;
  showRemove?: boolean;
}

export function CartLineItem({ item, showRemove = true }: CartLineItemProps) {
  const adjustSqFt = useCartStore((state) => state.adjustSqFt);
  const removeItem = useCartStore((state) => state.removeItem);
  const step = item.boxCoverageSqFt;

  return (
    <li className="grid grid-cols-[68px_1fr_auto] gap-4 border-b border-cream pb-5">
      <Link
        href={`/product/${item.slug}`}
        className="block h-[52px] bg-cream bg-cover bg-center no-underline"
        style={
          item.imageUrl
            ? { backgroundImage: `url(${item.imageUrl})` }
            : undefined
        }
        aria-label={`View ${item.name}`}
      />
      <div>
        <Link
          href={`/product/${item.slug}`}
          className="font-serif text-[17px] text-espresso no-underline hover:text-walnut"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.series} | {formatCartCurrency(item.pricePerSqFt)}/sq ft
        </p>
        <div className="mt-2 flex items-center gap-2 text-[13px] text-walnut">
          <button
            type="button"
            onClick={() => adjustSqFt(item.productId, -step)}
            className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center border border-sand bg-white text-[15px] text-walnut transition-colors hover:border-espresso hover:text-espresso"
            aria-label={`Decrease ${item.name} quantity`}
          >
            -
          </button>
          <span>{item.sqFt.toFixed(1)} sq ft</span>
          <button
            type="button"
            onClick={() => adjustSqFt(item.productId, step)}
            className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center border border-sand bg-white text-[15px] text-walnut transition-colors hover:border-espresso hover:text-espresso"
            aria-label={`Increase ${item.name} quantity`}
          >
            +
          </button>
        </div>
        {showRemove ? (
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="mt-2 cursor-pointer text-xs text-walnut underline"
          >
            Remove
          </button>
        ) : null}
      </div>
      <p className="font-serif text-lg whitespace-nowrap text-espresso">
        {formatCartCurrency(getLineTotal(item))}
      </p>
    </li>
  );
}
