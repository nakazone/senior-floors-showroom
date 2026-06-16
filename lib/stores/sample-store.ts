import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_SAMPLES } from "@/lib/samples";

export interface SampleSelectionItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  hexPrimary?: string;
  hexSecondary?: string;
}

interface SampleStore {
  items: SampleSelectionItem[];
  toggleItem: (item: SampleSelectionItem) => "added" | "removed" | "limit_reached";
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isSelected: (productId: string) => boolean;
  itemCount: () => number;
}

export const useSampleStore = create<SampleStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const existing = get().items.find(
          (entry) => entry.productId === item.productId,
        );

        if (existing) {
          set((state) => ({
            items: state.items.filter(
              (entry) => entry.productId !== item.productId,
            ),
          }));
          return "removed";
        }

        if (get().items.length >= MAX_SAMPLES) {
          return "limit_reached";
        }

        set((state) => ({
          items: [...state.items, item],
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
    { name: "sf-studio-samples" },
  ),
);
