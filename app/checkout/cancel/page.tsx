import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  description: "Your checkout was cancelled and your cart was preserved.",
};

export default function CheckoutCancelPage() {
  return (
    <SiteLayout>
      <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
        <div className="section-inner max-w-2xl">
          <div className="border border-sand bg-white p-10 text-center">
            <span className="eyebrow">Checkout</span>
            <h1 className="display-heading mb-4">
              Checkout <em>cancelled</em>
            </h1>
            <p className="mb-8 text-walnut">
              No payment was taken. Your cart items are still saved so you can
              finish whenever you are ready.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
              >
                Return to checkout
              </Link>
              <Link
                href="/shop"
                className="inline-block border border-espresso px-6 py-3 text-sm font-medium tracking-wide text-espresso uppercase no-underline"
              >
                Browse flooring
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
