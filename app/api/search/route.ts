import { NextResponse } from "next/server";
import { searchAlgoliaSuggestions } from "@/lib/algolia-products";
import prisma from "@/lib/prisma";
import { isAlgoliaConfigured } from "@/lib/algolia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ hits: [] });
  }

  if (isAlgoliaConfigured()) {
    const hits = await searchAlgoliaSuggestions(query, 8);
    if (hits) {
      return NextResponse.json({ hits, source: "algolia" });
    }
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { series: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 1,
          select: { url: true },
        },
      },
      take: 8,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      source: "database",
      hits: products.map((product) => ({
        objectID: product.id,
        slug: product.slug,
        name: product.name,
        series: product.series,
        pricePerSqFt: Number(product.pricePerSqFt),
        imageUrl: product.images[0]?.url ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ hits: [], source: "database" });
  }
}
