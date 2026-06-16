"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";

export function CartDrawerContent() {
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <ul className="space-y-5">
            {items.map((item) => (
              <CartLineItem key={item.productId} item={item} />
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 ? (
        <div className="border-t border-cream px-8 py-6">
          <CartSummary
            items={items}
            onCheckoutNavigate={() => setOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}

export function CartBadgeCount() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? items.length : 0;

  if (itemCount === 0) return null;

  return (
    <span className="absolute top-0.5 right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-espresso">
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}
