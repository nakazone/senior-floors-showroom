import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Quotes API not configured yet - step 6" },
    { status: 501 },
  );
}
