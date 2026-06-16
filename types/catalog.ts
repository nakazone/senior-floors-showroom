import type { ProductType } from "@/types";

export interface CatalogFilters {
  query?: string;
  type?: ProductType;
  colorFamily?: string;
  colorTone?: "light" | "medium" | "dark";
  thickness?: string;
  wearLayer?: string;
  series?: string;
  minPrice?: number;
  maxPrice?: number;
  waterproof?: boolean;
  petFriendly?: boolean;
  installType?: string;
  width?: string;
  length?: string;
  finish?: string;
  style?: string;
  room?: string;
}

export interface CatalogFacets {
  types: ProductType[];
  colorFamilies: string[];
  thicknesses: string[];
  wearLayers: string[];
  series: string[];
  installTypes: string[];
  widths: string[];
  lengths: string[];
  finishes: string[];
  styles: string[];
  rooms: string[];
  priceMin: number;
  priceMax: number;
}

export const colorToneGroups = {
  light: ["light-oak", "white-oak", "natural"],
  medium: ["brown", "natural"],
  dark: ["dark"],
} as const;

export const categorySlugFilters: Record<string, Partial<CatalogFilters>> = {
  "lvp-flooring": { type: "LVP" },
  "engineered-hardwood": { type: "ENGINEERED" },
  "luxury-vinyl-plank": { type: "LVP" },
  "waterproof-flooring": { waterproof: true },
};

export function formatColorFamily(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatProductType(type: ProductType) {
  if (type === "LVP") return "LVP";
  if (type === "ENGINEERED") return "Engineered";
  return "Hardwood";
}
