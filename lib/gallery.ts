import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { mockGalleryItems } from "@/lib/home-data";

export interface InspirationGalleryItem {
  id: string;
  imageUrl: string;
  roomType: string;
  style: string;
  productSlug?: string | null;
  productName?: string | null;
}

export interface GalleryFilters {
  room?: string;
  style?: string;
}

export const galleryRoomFilters = [
  { value: "all", label: "All Rooms" },
  { value: "living-room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "basement", label: "Basement" },
] as const;

export const galleryStyleFilters = [
  { value: "modern", label: "Modern" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "contemporary", label: "Contemporary" },
  { value: "luxury", label: "Luxury" },
] as const;

function mapGalleryItem(
  item: {
    id: string;
    imageUrl: string;
    roomType: string;
    style: string;
    product?: { slug: string; name: string } | null;
  },
): InspirationGalleryItem {
  return {
    id: item.id,
    imageUrl: item.imageUrl,
    roomType: item.roomType,
    style: item.style,
    productSlug: item.product?.slug ?? null,
    productName: item.product?.name ?? null,
  };
}

function mapMockGalleryItems(): InspirationGalleryItem[] {
  const slugByName: Record<string, string> = {
    "Heritage Oak": "heritage-oak",
    "Nordic Blonde": "nordic-blonde",
    "Ash Silver": "ash-silver",
    "Barnwood Rustic": "barnwood-rustic",
    "Grand Oak Plank": "grand-oak-plank",
    "White Oak Premium": "white-oak-premium",
  };

  return mockGalleryItems.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    roomType: item.roomType,
    style: item.style,
    productName: item.productName,
    productSlug: item.productName ? slugByName[item.productName] ?? null : null,
  }));
}

export function parseGallerySearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): GalleryFilters {
  const room = Array.isArray(searchParams.room)
    ? searchParams.room[0]
    : searchParams.room;
  const style = Array.isArray(searchParams.style)
    ? searchParams.style[0]
    : searchParams.style;

  return {
    room: room || undefined,
    style: style || undefined,
  };
}

function buildGalleryWhere(filters: GalleryFilters): Prisma.GalleryItemWhereInput {
  const and: Prisma.GalleryItemWhereInput[] = [];

  if (filters.room) {
    and.push({ roomType: filters.room });
  }

  if (filters.style) {
    and.push({ style: filters.style });
  }

  return and.length > 0 ? { AND: and } : {};
}

function filterMockItems(
  items: InspirationGalleryItem[],
  filters: GalleryFilters,
) {
  return items.filter((item) => {
    if (filters.room && item.roomType !== filters.room) return false;
    if (filters.style && item.style !== filters.style) return false;
    return true;
  });
}

export async function getInspirationGalleryItems(
  filters: GalleryFilters = {},
): Promise<InspirationGalleryItem[]> {
  try {
    const items = await prisma.galleryItem.findMany({
      where: buildGalleryWhere(filters),
      include: {
        product: {
          select: { slug: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (items.length === 0 && !filters.room && !filters.style) {
      return mapMockGalleryItems();
    }

    if (items.length === 0) {
      return filterMockItems(mapMockGalleryItems(), filters);
    }

    return items.map(mapGalleryItem);
  } catch {
    return filterMockItems(mapMockGalleryItems(), filters);
  }
}

export function formatGalleryLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
