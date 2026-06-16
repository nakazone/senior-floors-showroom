"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  CartBadgeCount,
  CartDrawerContent,
} from "@/components/cart/cart-drawer-content";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger
        className="relative flex min-h-11 min-w-11 items-center justify-center text-walnut transition-colors hover:text-espresso focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} />
        <CartBadgeCount />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col bg-white p-0 sm:max-w-[420px]"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-cream px-8 py-6">
          <SheetTitle className="font-serif text-[22px] font-normal text-espresso">
            Your Cart
          </SheetTitle>
        </SheetHeader>
        <CartDrawerContent />
      </SheetContent>
    </Sheet>
  );
}
