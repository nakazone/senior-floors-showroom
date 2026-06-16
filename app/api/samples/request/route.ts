import { NextResponse } from "next/server";
import { requestSamples } from "@/app/actions/samples";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await requestSamples(body as Parameters<typeof requestSamples>[0]);

  if (result.success) {
    return NextResponse.json({
      requestId: result.requestId,
      isPaid: result.isPaid,
    });
  }

  if ("requiresPayment" in result && result.requiresPayment) {
    return NextResponse.json(
      {
        requiresPayment: true,
        amount: result.amount,
        unitPrice: result.unitPrice,
        sampleCount: result.sampleCount,
      },
      { status: 402 },
    );
  }

  const errorMessage =
    "error" in result ? result.error : "Unable to create sample request";

  return NextResponse.json({ error: errorMessage }, { status: 400 });
}
