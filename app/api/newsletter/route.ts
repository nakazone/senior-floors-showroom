import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Newsletter not configured yet" },
    { status: 501 },
  );
}
