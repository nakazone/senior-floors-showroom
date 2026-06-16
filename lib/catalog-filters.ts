import type { Prisma } from "@prisma/client";
import type { ProductType } from "@/types";
import {
  categorySlugFilters,
  colorToneGroups,
  type CatalogFilters,
} from "@/types/catalog";

type SearchParamValue = string | string[] | undefined;

function getParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseBoolean(value: SearchParamValue): boolean | undefined {
  const raw = getParam(value);
  if (raw === "1" || raw === "true") return true;
  if (raw === "0" || raw === "false") return false;
  return undefined;
}

function parseNumber(value: SearchParamValue): number | undefined {
  const raw = getParam(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseProductType(value: SearchParamValue): ProductType | undefined {
  const raw = getParam(value)?.toUpperCase();
  if (raw === "LVP" || raw === "ENGINEERED" || raw === "HARDWOOD") {
    return raw;
  }
  return undefined;
}

export function parseCatalogSearchParams(
  searchParams: Record<string, SearchParamValue>,
  baseFilters: Partial<CatalogFilters> = {},
): CatalogFilters {
  const tone = getParam(searchParams.tone);
  const colorTone =
    tone === "light" || tone === "medium" || tone === "dark" ? tone : undefined;

  return {
    ...baseFilters,
    query: getParam(searchParams.q) ?? baseFilters.query,
    type: parseProductType(searchParams.material) ?? baseFilters.type,
    colorFamily: getParam(searchParams.color) ?? baseFilters.colorFamily,
    colorTone: colorTone ?? baseFilters.colorTone,
    thickness: getParam(searchParams.thickness) ?? baseFilters.thickness,
    wearLayer: getParam(searchParams.wear) ?? baseFilters.wearLayer,
    series: getParam(searchParams.brand) ?? baseFilters.series,
    minPrice: parseNumber(searchParams.minPrice) ?? baseFilters.minPrice,
    maxPrice: parseNumber(searchParams.maxPrice) ?? baseFilters.maxPrice,
    waterproof:
      parseBoolean(searchParams.waterproof) ?? baseFilters.waterproof,
    petFriendly:
      parseBoolean(searchParams.petFriendly) ?? baseFilters.petFriendly,
    installType: getParam(searchParams.install) ?? baseFilters.installType,
    width: getParam(searchParams.width) ?? baseFilters.width,
    length: getParam(searchParams.length) ?? baseFilters.length,
    finish: getParam(searchParams.finish) ?? baseFilters.finish,
    style: getParam(searchParams.style) ?? baseFilters.style,
    room: getParam(searchParams.room) ?? baseFilters.room,
  };
}

export function getCategoryBaseFilters(
  categorySlug: string,
): Partial<CatalogFilters> {
  return categorySlugFilters[categorySlug] ?? {};
}

export function buildCatalogWhere(
  filters: CatalogFilters,
): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];

  if (filters.type) and.push({ type: filters.type });
  if (filters.colorFamily) and.push({ colorFamily: filters.colorFamily });
  if (filters.colorTone) {
    and.push({
      colorFamily: { in: [...colorToneGroups[filters.colorTone]] },
    });
  }
  if (filters.thickness) and.push({ thickness: filters.thickness });
  if (filters.wearLayer) and.push({ wearLayer: filters.wearLayer });
  if (filters.series) and.push({ series: filters.series });
  if (filters.waterproof) and.push({ waterproof: true });
  if (filters.petFriendly) and.push({ petFriendly: true });
  if (filters.installType) and.push({ installType: filters.installType });
  if (filters.width) and.push({ width: filters.width });
  if (filters.length) and.push({ length: filters.length });
  if (filters.finish) and.push({ finish: filters.finish });
  if (filters.style) and.push({ style: { has: filters.style } });
  if (filters.room) and.push({ rooms: { has: filters.room } });

  if (filters.query) {
    and.push({
      OR: [
        { name: { contains: filters.query, mode: "insensitive" } },
        { series: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
      ],
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    and.push({
      pricePerSqFt: {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      },
    });
  }

  return and.length > 0 ? { AND: and } : {};
}

export function countActiveFilters(filters: CatalogFilters): number {
  return [
    filters.query,
    filters.type,
    filters.colorFamily,
    filters.colorTone,
    filters.thickness,
    filters.wearLayer,
    filters.series,
    filters.minPrice,
    filters.maxPrice,
    filters.waterproof,
    filters.petFriendly,
    filters.installType,
    filters.width,
    filters.length,
    filters.finish,
    filters.style,
    filters.room,
  ].filter((value) => value !== undefined && value !== false).length;
}
