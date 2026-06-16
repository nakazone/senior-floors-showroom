import { NextResponse } from "next/server";
import { getSampleRequestByStripeSession } from "@/lib/sample-requests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const sampleRequest = await getSampleRequestByStripeSession(sessionId);

  if (!sampleRequest) {
    return NextResponse.json({ request: null });
  }

  return NextResponse.json({
    request: {
      id: sampleRequest.id,
      status: sampleRequest.status,
      isPaid: sampleRequest.isPaid,
      items: sampleRequest.items.map((item) => ({
        name: item.product.name,
        slug: item.product.slug,
      })),
    },
  });
}
