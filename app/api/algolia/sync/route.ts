import { NextResponse } from "next/server";
import { syncProductsToAlgolia } from "@/lib/algolia-products";
import { isAlgoliaAdminConfigured } from "@/lib/algolia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.ALGOLIA_SYNC_SECRET;
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAlgoliaAdminConfigured()) {
    return NextResponse.json(
      { error: "Algolia admin credentials are not configured" },
      { status: 503 },
    );
  }

  try {
    const result = await syncProductsToAlgolia();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Algolia sync failed:", error);
    return NextResponse.json(
      { error: "Unable to sync products to Algolia" },
      { status: 500 },
    );
  }
}
