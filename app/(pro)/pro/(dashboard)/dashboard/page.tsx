import { ProOverview } from "@/components/pro/pro-overview";
import { requireApprovedPro } from "@/lib/auth";
import { getProDiscountPercent, getProOverview } from "@/lib/pro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Dashboard",
};

export default async function ProDashboardPage() {
  const { customer } = await requireApprovedPro();
  const [overview, discountPercent] = await Promise.all([
    getProOverview(customer.id),
    Promise.resolve(getProDiscountPercent(customer)),
  ]);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Overview
      </h1>
      <ProOverview
        accountType={customer.accountType}
        discountPercent={discountPercent}
        overview={overview}
      />
    </section>
  );
}
