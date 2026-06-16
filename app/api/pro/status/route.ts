import { NextResponse } from "next/server";
import { getCustomerForUser } from "@/lib/auth";
import {
  formatAccountType,
  getProDiscountPercent,
  isApprovedPro,
} from "@/lib/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCustomerForUser();

    if (!customer || !isApprovedPro(customer)) {
      return NextResponse.json({ isPro: false });
    }

    return NextResponse.json({
      isPro: true,
      accountType: customer.accountType,
      accountTypeLabel: formatAccountType(customer.accountType),
      discountPercent: getProDiscountPercent(customer),
    });
  } catch {
    return NextResponse.json({ isPro: false });
  }
}
