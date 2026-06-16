import { ProPricingCard } from "@/components/pro/pro-pricing-card";
import { requireApprovedPro } from "@/lib/auth";
import { getProDiscountPercent } from "@/lib/pro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Pricing",
};

export default async function ProPricingPage() {
  const { customer } = await requireApprovedPro();
  const discountPercent = getProDiscountPercent(customer);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Pricing
      </h1>
      <ProPricingCard
        accountType={customer.accountType}
        discountPercent={discountPercent}
      />
    </section>
  );
}
