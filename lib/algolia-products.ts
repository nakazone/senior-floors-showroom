import type { Product } from "@/types";
import type { CatalogFilters } from "@/types/catalog";
import { colorToneGroups } from "@/types/catalog";
import { mapDbProduct } from "@/lib/product-mapper";
import {
  getAlgoliaAdminClient,
  getAlgoliaSearchClient,
  isAlgoliaAdminConfigured,
  isAlgoliaConfigured,
  PRODUCTS_INDEX,
} from "@/lib/algolia";
import prisma from "@/lib/prisma";

export interface AlgoliaProductRecord {
  objectID: string;
  slug: string;
  name: string;
  series: string;
  description: string;
  type: string;
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
  compareAtPrice: number | null;
  stockSqFt: number;
  boxCoverageSqFt: number;
  imageUrl: string | null;
}

export interface ProductSearchHit {
  objectID: string;
  slug: string;
  name: string;
  series: string;
  pricePerSqFt: number;
  imageUrl: string | null;
}

const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
};

const INDEX_SETTINGS = {
  searchableAttributes: [
    "name",
    "series",
    "description",
    "unordered(colorFamily)",
    "unordered(style)",
    "unordered(rooms)",
    "type",
    "finish",
    "installType",
  ],
  attributesForFaceting: [
    "filterOnly(type)",
    "filterOnly(colorFamily)",
    "filterOnly(thickness)",
    "filterOnly(wearLayer)",
    "filterOnly(series)",
    "filterOnly(installType)",
    "filterOnly(width)",
    "filterOnly(length)",
    "filterOnly(finish)",
    "searchable(style)",
    "searchable(rooms)",
    "filterOnly(waterproof)",
    "filterOnly(petFriendly)",
  ],
  customRanking: ["asc(pricePerSqFt)"],
};

export function mapProductToAlgoliaRecord(
  product: ReturnType<typeof mapDbProduct>,
): AlgoliaProductRecord {
  return {
    objectID: product.id,
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
    pricePerSqFt: product.pricePerSqFt,
    compareAtPrice: product.compareAtPrice ?? null,
    stockSqFt: product.stockSqFt,
    boxCoverageSqFt: product.boxCoverageSqFt,
    imageUrl: product.images?.[0]?.url ?? null,
  };
}

export function mapAlgoliaHitToProduct(hit: AlgoliaProductRecord): Product {
  return {
    id: hit.objectID,
    slug: hit.slug,
    name: hit.name,
    series: hit.series,
    description: hit.description,
    type: hit.type as Product["type"],
    colorFamily: hit.colorFamily,
    style: hit.style,
    rooms: hit.rooms,
    thickness: hit.thickness,
    wearLayer: hit.wearLayer,
    width: hit.width,
    length: hit.length,
    finish: hit.finish,
    installType: hit.installType,
    warranty: hit.warranty,
    waterproof: hit.waterproof,
    petFriendly: hit.petFriendly,
    pricePerSqFt: hit.pricePerSqFt,
    compareAtPrice: hit.compareAtPrice,
    stockSqFt: hit.stockSqFt,
    boxCoverageSqFt: hit.boxCoverageSqFt,
    images: hit.imageUrl
      ? [
          {
            id: `${hit.objectID}-image`,
            url: hit.imageUrl,
            type: "gallery",
            position: 0,
          },
        ]
      : [],
  };
}

function quoteFilterValue(value: string) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

export function buildAlgoliaFilterString(filters: CatalogFilters) {
  const parts: string[] = [];

  if (filters.type) parts.push(`type:${quoteFilterValue(filters.type)}`);
  if (filters.colorFamily) {
    parts.push(`colorFamily:${quoteFilterValue(filters.colorFamily)}`);
  }
  if (filters.colorTone) {
    const families = colorToneGroups[filters.colorTone];
    const toneFilter = families
      .map((family) => `colorFamily:${quoteFilterValue(family)}`)
      .join(" OR ");
    parts.push(`(${toneFilter})`);
  }
  if (filters.thickness) {
    parts.push(`thickness:${quoteFilterValue(filters.thickness)}`);
  }
  if (filters.wearLayer) {
    parts.push(`wearLayer:${quoteFilterValue(filters.wearLayer)}`);
  }
  if (filters.series) parts.push(`series:${quoteFilterValue(filters.series)}`);
  if (filters.installType) {
    parts.push(`installType:${quoteFilterValue(filters.installType)}`);
  }
  if (filters.width) parts.push(`width:${quoteFilterValue(filters.width)}`);
  if (filters.length) parts.push(`length:${quoteFilterValue(filters.length)}`);
  if (filters.finish) parts.push(`finish:${quoteFilterValue(filters.finish)}`);
  if (filters.style) parts.push(`style:${quoteFilterValue(filters.style)}`);
  if (filters.room) parts.push(`rooms:${quoteFilterValue(filters.room)}`);
  if (filters.waterproof) parts.push("waterproof:true");
  if (filters.petFriendly) parts.push("petFriendly:true");

  if (filters.minPrice !== undefined) {
    parts.push(`pricePerSqFt >= ${filters.minPrice}`);
  }
  if (filters.maxPrice !== undefined) {
    parts.push(`pricePerSqFt <= ${filters.maxPrice}`);
  }

  return parts.join(" AND ");
}

export async function searchAlgoliaProducts(
  filters: CatalogFilters,
): Promise<Product[] | null> {
  if (!isAlgoliaConfigured()) return null;

  try {
    const client = getAlgoliaSearchClient();
    const filterString = buildAlgoliaFilterString(filters);

    const response = await client.searchSingleIndex<AlgoliaProductRecord>({
      indexName: PRODUCTS_INDEX,
      searchParams: {
        query: filters.query ?? "",
        filters: filterString || undefined,
        hitsPerPage: 100,
      },
    });

    return response.hits.map(mapAlgoliaHitToProduct);
  } catch (error) {
    console.error("Algolia catalog search failed:", error);
    return null;
  }
}

export async function searchAlgoliaSuggestions(
  query: string,
  limit = 6,
): Promise<ProductSearchHit[] | null> {
  if (!isAlgoliaConfigured() || !query.trim()) return null;

  try {
    const client = getAlgoliaSearchClient();
    const response = await client.searchSingleIndex<AlgoliaProductRecord>({
      indexName: PRODUCTS_INDEX,
      searchParams: {
        query: query.trim(),
        hitsPerPage: limit,
        attributesToRetrieve: [
          "objectID",
          "slug",
          "name",
          "series",
          "pricePerSqFt",
          "imageUrl",
        ],
      },
    });

    return response.hits.map((hit) => ({
      objectID: hit.objectID,
      slug: hit.slug,
      name: hit.name,
      series: hit.series,
      pricePerSqFt: hit.pricePerSqFt,
      imageUrl: hit.imageUrl,
    }));
  } catch (error) {
    console.error("Algolia suggestion search failed:", error);
    return null;
  }
}

export async function configureProductsIndex() {
  const client = getAlgoliaAdminClient();

  await client.setSettings({
    indexName: PRODUCTS_INDEX,
    indexSettings: INDEX_SETTINGS,
  });
}

export async function syncProductsToAlgolia() {
  if (!isAlgoliaAdminConfigured()) {
    throw new Error("Algolia admin credentials are not configured");
  }

  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: [{ series: "asc" }, { name: "asc" }],
  });

  const records = products.map((product) =>
    mapProductToAlgoliaRecord(mapDbProduct(product)),
  );

  const client = getAlgoliaAdminClient();

  await configureProductsIndex();

  if (records.length === 0) {
    await client.clearObjects({ indexName: PRODUCTS_INDEX });
    return { indexed: 0 };
  }

  await client.saveObjects({
    indexName: PRODUCTS_INDEX,
    objects: records as unknown as Record<string, unknown>[],
    waitForTasks: true,
  });

  return { indexed: records.length };
}
