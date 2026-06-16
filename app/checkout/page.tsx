import { SiteLayout } from "@/components/layout/site-layout";
import { CheckoutView } from "@/components/checkout/checkout-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your flooring order before secure Stripe checkout.",
};

export default function CheckoutPage() {
  return (
    <SiteLayout>
      <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
        <div className="section-inner max-w-5xl">
          <span className="eyebrow">Checkout</span>
          <h1 className="display-heading mb-8">
            Review your <em>order</em>
          </h1>
          <CheckoutView />
        </div>
      </main>
    </SiteLayout>
  );
}
