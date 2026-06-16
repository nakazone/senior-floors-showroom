import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_SAMPLE_BOX_SIZE,
  getMaxSamples,
  type SampleBoxSize,
} from "@/lib/samples";

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
  boxSize: SampleBoxSize;
  setBoxSize: (size: SampleBoxSize) => void;
  toggleItem: (item: SampleSelectionItem) => "added" | "removed" | "limit_reached";
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isSelected: (productId: string) => boolean;
  itemCount: () => number;
  maxSamples: () => number;
}

export const useSampleStore = create<SampleStore>()(
  persist(
    (set, get) => ({
      items: [],
      boxSize: DEFAULT_SAMPLE_BOX_SIZE,
      setBoxSize: (size) => {
        const max = getMaxSamples(size);
        set((state) => ({
          boxSize: size,
          items: state.items.slice(0, max),
        }));
      },
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

        const max = get().maxSamples();
        if (get().items.length >= max) {
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
      maxSamples: () => getMaxSamples(get().boxSize),
    }),
    { name: "sf-studio-samples" },
  ),
);
