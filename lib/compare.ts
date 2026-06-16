import type { CompareItem, Product } from "@/types";

export const MAX_COMPARE_ITEMS = 4;

export function productToCompareItem(product: Product): CompareItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    series: product.series,
    thickness: product.thickness,
    wearLayer: product.wearLayer,
    waterproof: product.waterproof,
    petFriendly: product.petFriendly,
    installType: product.installType,
    width: product.width,
    finish: product.finish,
    warranty: product.warranty,
    pricePerSqFt: product.pricePerSqFt,
    boxCoverageSqFt: product.boxCoverageSqFt,
    imageUrl: product.images?.[0]?.url,
  };
}

export function normalizeCompareItem(item: CompareItem): CompareItem {
  return {
    ...item,
    series: item.series ?? "",
    installType: item.installType ?? "",
    boxCoverageSqFt: item.boxCoverageSqFt && item.boxCoverageSqFt > 0 ? item.boxCoverageSqFt : 20,
  };
}
