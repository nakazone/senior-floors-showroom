export type ProductType = "LVP" | "ENGINEERED" | "HARDWOOD";

export type AccountType = "RETAIL" | "CONTRACTOR" | "DESIGNER" | "BUILDER";

export type ProStatus = "PENDING" | "APPROVED" | "REJECTED";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type SampleStatus = "REQUESTED" | "SHIPPED" | "DELIVERED";

export type QuoteStatus = "OPEN" | "CONVERTED" | "EXPIRED";

export interface ProductImage {
  id: string;
  url: string;
  type: "gallery" | "room-scene" | "macro-texture" | "video";
  position: number;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  hexPrimary: string;
  hexSecondary: string;
  swatchUrl?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  series: string;
  description: string;
  type: ProductType;
  colorFamily: string;
  style: string[];
  rooms: string[];
  thickness: string;
  wearLayer: string;
  width: string;
  length: string;
  finish: string;
  installType: string;
  warranty: string;
  waterproof: boolean;
  petFriendly: boolean;
  pricePerSqFt: number;
  compareAtPrice?: number | null;
  stockSqFt: number;
  boxCoverageSqFt: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  series: string;
  pricePerSqFt: number;
  sqFt: number;
  boxCoverageSqFt: number;
  imageUrl?: string;
}

export interface CompareItem {
  productId: string;
  slug: string;
  name: string;
  series: string;
  thickness: string;
  wearLayer: string;
  waterproof: boolean;
  petFriendly: boolean;
  installType: string;
  width: string;
  finish: string;
  warranty: string;
  pricePerSqFt: number;
  boxCoverageSqFt?: number;
  imageUrl?: string;
}

export interface FloorCalculatorResult {
  length: number;
  width: number;
  sqFt: number;
  boxesNeeded: number;
  totalPrice: number;
}

export interface AiFinderQuizAnswers {
  pets: boolean;
  kids: boolean;
  room: string;
  style: string;
  budget: string;
}

export interface AiFinderResponse {
  reasoning: string;
  recommendedProductTypes: string[];
  recommendedFilters: Record<string, string | string[] | boolean>;
  products: Product[];
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SeoFilterPage {
  slug: string;
  title: string;
  description: string;
  filterKey: "type" | "colorFamily" | "style" | "rooms" | "waterproof";
  filterValue: string;
}
