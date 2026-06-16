import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { CheckoutSuccessView } from "@/components/checkout/checkout-success-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Senior Floors Studio order has been confirmed.",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <SiteLayout>
      <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
        <div className="section-inner max-w-4xl">
          {sessionId ? (
            <CheckoutSuccessView sessionId={sessionId} />
          ) : (
            <div className="border border-sand bg-white p-10 text-center">
              <h1 className="mb-4 font-serif text-3xl font-light text-espresso">
                Order confirmed
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Your payment was successful. Check your email for order details.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}
