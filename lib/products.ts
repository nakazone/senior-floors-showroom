import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { searchAlgoliaProducts } from "@/lib/algolia-products";
import { mapDbProduct } from "@/lib/product-mapper";
import { buildCatalogWhere } from "@/lib/catalog-filters";
import type { CatalogFacets, CatalogFilters } from "@/types/catalog";
import type { Product, ProductType } from "@/types";

const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
};

const emptyFacets: CatalogFacets = {
  types: ["LVP", "ENGINEERED", "HARDWOOD"],
  colorFamilies: ["light-oak", "white-oak", "natural", "brown", "dark"],
  thicknesses: ["6mm", "8mm", "14mm", "16mm", "18mm", "20mm"],
  wearLayers: ["12 mil", "20 mil", "3 mm", "4 mm", "5 mm", "6 mm"],
  series: ["Prestige LVP", "Nordic Collection", "Grand Plank", "Dark Edition"],
  installTypes: ["click-lock", "glue-down", "float"],
  widths: ['5"', '6"', '7"', '8"', '9"', '12"', '14"'],
  lengths: ['48"', "RL"],
  finishes: ["Matte", "Low Gloss", "Satin", "UV Oil", "Natural Oil"],
  styles: ["modern", "contemporary", "farmhouse", "scandinavian", "luxury"],
  rooms: ["living-room", "bedroom", "kitchen", "basement", "office"],
  priceMin: 3,
  priceMax: 13,
};

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function buildFacetsFromRows(
  rows: Array<{
    type: ProductType;
    colorFamily: string;
    thickness: string;
    wearLayer: string;
    series: string;
    installType: string;
    width: string;
    length: string;
    finish: string;
    style: string[];
    rooms: string[];
    pricePerSqFt: Prisma.Decimal;
  }>,
): CatalogFacets {
  if (rows.length === 0) return emptyFacets;

  const prices = rows.map((row) => Number(row.pricePerSqFt));

  return {
    types: uniqueSorted(rows.map((row) => row.type)) as ProductType[],
    colorFamilies: uniqueSorted(rows.map((row) => row.colorFamily)),
    thicknesses: uniqueSorted(rows.map((row) => row.thickness)),
    wearLayers: uniqueSorted(rows.map((row) => row.wearLayer)),
    series: uniqueSorted(rows.map((row) => row.series)),
    installTypes: uniqueSorted(rows.map((row) => row.installType)),
    widths: uniqueSorted(rows.map((row) => row.width)),
    lengths: uniqueSorted(rows.map((row) => row.length)),
    finishes: uniqueSorted(rows.map((row) => row.finish)),
    styles: uniqueSorted(rows.flatMap((row) => row.style)),
    rooms: uniqueSorted(rows.flatMap((row) => row.rooms)),
    priceMin: Math.floor(Math.min(...prices)),
    priceMax: Math.ceil(Math.max(...prices)),
  };
}

export async function getCatalogFacets(): Promise<CatalogFacets> {
  try {
    const rows = await prisma.product.findMany({
      select: {
        type: true,
        colorFamily: true,
        thickness: true,
        wearLayer: true,
        series: true,
        installType: true,
        width: true,
        length: true,
        finish: true,
        style: true,
        rooms: true,
        pricePerSqFt: true,
      },
    });

    return buildFacetsFromRows(rows);
  } catch {
    return emptyFacets;
  }
}

export async function searchCatalogProducts(
  filters: CatalogFilters,
): Promise<Product[]> {
  const algoliaResults = await searchAlgoliaProducts(filters);
  if (algoliaResults) {
    return algoliaResults;
  }

  try {
    const products = await prisma.product.findMany({
      where: buildCatalogWhere(filters),
      include: productInclude,
      orderBy: [{ series: "asc" }, { name: "asc" }],
    });

    return products.map(mapDbProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    return product ? mapDbProduct(product) : null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  product: Pick<Product, "id" | "colorFamily" | "style">,
  limit = 4,
): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { colorFamily: product.colorFamily },
          { style: { hasSome: product.style } },
        ],
      },
      include: productInclude,
      take: limit,
    });

    return products.map(mapDbProduct);
  } catch {
    return [];
  }
}

export async function getProductReviewStats(productId: string) {
  try {
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    if (!stats._count.id) {
      return { ratingValue: 4.9, reviewCount: 0 };
    }

    return {
      ratingValue: Math.round((stats._avg.rating ?? 5) * 10) / 10,
      reviewCount: stats._count.id,
    };
  } catch {
    return { ratingValue: 4.9, reviewCount: 0 };
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return searchCatalogProducts({}).then((products) => products.slice(0, limit));
}

export async function getAllProductSlugs() {
  try {
    return await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}
