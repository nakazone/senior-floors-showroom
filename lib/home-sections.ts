import type { Product } from "@/types";
import { colorToneGroups } from "@/types/catalog";

export type HomeCatalogFilterId =
  | "all"
  | "lvp"
  | "engineered"
  | "light"
  | "medium"
  | "dark"
  | "wide"
  | "waterproof"
  | "petfriendly";

export const homeCatalogFilterGroups = [
  {
    chips: [
      { id: "all" as const, label: "All" },
      { id: "lvp" as const, label: "LVP" },
      { id: "engineered" as const, label: "Engineered" },
    ],
  },
  {
    chips: [
      { id: "light" as const, label: "Light Tones" },
      { id: "medium" as const, label: "Medium" },
      { id: "dark" as const, label: "Dark Tones" },
    ],
  },
  {
    chips: [
      { id: "wide" as const, label: "Wide Plank" },
      { id: "waterproof" as const, label: "Waterproof" },
      { id: "petfriendly" as const, label: "Pet Friendly" },
    ],
  },
] as const;

export function filterHomeCatalogProducts(
  products: Product[],
  filterId: HomeCatalogFilterId,
): Product[] {
  if (filterId === "all") return products;

  return products.filter((product) => {
    switch (filterId) {
      case "lvp":
        return product.type === "LVP";
      case "engineered":
        return product.type === "ENGINEERED";
      case "light":
        return colorToneGroups.light.includes(
          product.colorFamily as (typeof colorToneGroups.light)[number],
        );
      case "medium":
        return colorToneGroups.medium.includes(
          product.colorFamily as (typeof colorToneGroups.medium)[number],
        );
      case "dark":
        return colorToneGroups.dark.includes(
          product.colorFamily as (typeof colorToneGroups.dark)[number],
        );
      case "wide":
        return ['9"', '12"', '14"'].includes(product.width);
      case "waterproof":
        return product.waterproof;
      case "petfriendly":
        return product.petFriendly;
      default:
        return true;
    }
  });
}

export const visualizerSteps = [
  "Upload a photo of your room",
  "AI detects and replaces the floor instantly",
  "Switch products, direction and lighting",
  "Order or request a free sample",
] as const;

export const sampleProgramPerks = [
  "Free shipping on up to 3 samples",
  "Delivered in 2-4 business days",
  "No purchase required to order",
] as const;
