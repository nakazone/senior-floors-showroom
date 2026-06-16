import prisma from "@/lib/prisma";
import {
  getInspirationGalleryItems,
  type InspirationGalleryItem,
} from "@/lib/gallery";
import {
  aggregateRating,
  mockReviews,
} from "@/lib/home-data";

export interface HomeReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export type HomeGalleryItem = Pick<
  InspirationGalleryItem,
  "id" | "imageUrl" | "roomType" | "style" | "productName"
>;

export async function getHomeReviews(limit = 4): Promise<HomeReview[]> {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (reviews.length === 0) {
      return [...mockReviews];
    }

    return reviews.map((review) => ({
      id: review.id,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      verified: review.verified,
    }));
  } catch {
    return [...mockReviews];
  }
}

export async function getHomeGalleryItems(limit = 6): Promise<HomeGalleryItem[]> {
  try {
    const items = await getInspirationGalleryItems({});
    return items.slice(0, limit).map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      roomType: item.roomType,
      style: item.style,
      productName: item.productName,
    }));
  } catch {
    return [];
  }
}

export async function getHomeAggregateRating() {
  try {
    const stats = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    });

    if (!stats._count.id) {
      return aggregateRating;
    }

    return {
      ratingValue: Math.round((stats._avg.rating ?? aggregateRating.ratingValue) * 10) / 10,
      reviewCount: stats._count.id,
      bestRating: 5,
      worstRating: 1,
    };
  } catch {
    return aggregateRating;
  }
}
