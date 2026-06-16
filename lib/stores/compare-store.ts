import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MAX_COMPARE_ITEMS,
  normalizeCompareItem,
} from "@/lib/compare";
import type { CompareItem } from "@/types";

interface CompareStore {
  items: CompareItem[];
  toggleItem: (item: CompareItem) => "added" | "removed" | "limit_reached";
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isSelected: (productId: string) => boolean;
  itemCount: () => number;
}

function normalizeItems(items: CompareItem[]) {
  return items
    .map(normalizeCompareItem)
    .slice(0, MAX_COMPARE_ITEMS);
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const normalized = normalizeCompareItem(item);
        const existing = get().items.find(
          (entry) => entry.productId === normalized.productId,
        );

        if (existing) {
          set((state) => ({
            items: state.items.filter(
              (entry) => entry.productId !== normalized.productId,
            ),
          }));
          return "removed";
        }

        if (get().items.length >= MAX_COMPARE_ITEMS) {
          return "limit_reached";
        }

        set((state) => ({
          items: [...state.items, normalized],
        }));
        return "added";
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearAll: () => set({ items: [] }),
      isSelected: (productId) =>
        get().items.some((item) => item.productId === productId),
      itemCount: () => get().items.length,
    }),
    {
      name: "sf-studio-compare",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.items = normalizeItems(state.items);
      },
    },
  ),
);
