import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCartSubtotal, normalizeCartItem } from "@/lib/cart";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateSqFt: (productId: string, sqFt: number) => void;
  adjustSqFt: (productId: string, delta: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  openDrawer: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

function normalizeItems(items: CartItem[]) {
  return items.map(normalizeCartItem);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const nextItem = normalizeCartItem(item);
          const existing = state.items.find(
            (entry) => entry.productId === nextItem.productId,
          );

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((entry) =>
                entry.productId === nextItem.productId
                  ? normalizeCartItem({
                      ...entry,
                      sqFt: entry.sqFt + nextItem.sqFt,
                    })
                  : entry,
              ),
            };
          }

          return {
            isOpen: true,
            items: [...state.items, nextItem],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateSqFt: (productId, sqFt) =>
        set((state) => {
          if (sqFt <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? normalizeCartItem({ ...item, sqFt })
                : item,
            ),
          };
        }),
      adjustSqFt: (productId, delta) => {
        const item = get().items.find((entry) => entry.productId === productId);
        if (!item) return;

        get().updateSqFt(productId, item.sqFt + delta);
      },
      clearCart: () => set({ items: [], isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
      openDrawer: () => set({ isOpen: true }),
      itemCount: () => get().items.length,
      subtotal: () => getCartSubtotal(get().items),
    }),
    {
      name: "sf-studio-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.items = normalizeItems(state.items);
      },
    },
  ),
);
