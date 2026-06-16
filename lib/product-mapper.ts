import { Prisma } from "@prisma/client";
import type { Product, ProductImage } from "@/types";

export function decimalToNumber(value: Prisma.Decimal | number): number {
  if (typeof value === "number") return value;
  return value.toNumber();
}

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  series: string;
  description: string;
  type: Product["type"];
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
  pricePerSqFt: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  stockSqFt: number;
  boxCoverageSqFt: number;
  images?: { id: string; url: string; type: string; position: number }[];
  variants?: {
    id: string;
    colorName: string;
    hexPrimary: string;
    hexSecondary: string;
    swatchUrl: string | null;
  }[];
};

export function mapDbProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    series: product.series,
    description: product.description,
    type: product.type,
    colorFamily: product.colorFamily,
    style: product.style,
    rooms: product.rooms,
    thickness: product.thickness,
    wearLayer: product.wearLayer,
    width: product.width,
    length: product.length,
    finish: product.finish,
    installType: product.installType,
    warranty: product.warranty,
    waterproof: product.waterproof,
    petFriendly: product.petFriendly,
    pricePerSqFt: decimalToNumber(product.pricePerSqFt),
    compareAtPrice: product.compareAtPrice
      ? decimalToNumber(product.compareAtPrice)
      : null,
    stockSqFt: product.stockSqFt,
    boxCoverageSqFt: product.boxCoverageSqFt,
    images: product.images?.map((image) => ({
      id: image.id,
      url: image.url,
      type: image.type as ProductImage["type"],
      position: image.position,
    })),
    variants: product.variants,
  };
}
