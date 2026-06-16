import Link from "next/link";
import { OrdersList } from "@/components/account/orders-list";
import { QuotesList } from "@/components/account/quotes-list";
import { SamplesList } from "@/components/account/samples-list";
import { formatAccountType } from "@/lib/pro";
import type { AccountType } from "@/types";

type OverviewData = Awaited<
  ReturnType<typeof import("@/lib/pro").getProOverview>
>;

interface ProOverviewProps {
  accountType: AccountType;
  discountPercent: number;
  overview: OverviewData;
}

export function ProOverview({
  accountType,
  discountPercent,
  overview,
}: ProOverviewProps) {
  const { stats } = overview;

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active orders", value: stats.activeOrders },
          { label: "Total orders", value: stats.totalOrders },
          { label: "Open quotes", value: stats.openQuotes },
          { label: "Pending samples", value: stats.pendingSamples },
        ].map((stat) => (
          <div key={stat.label} className="border border-sand bg-bone p-4">
            <p className="text-[11px] tracking-wider text-walnut uppercase">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-3xl font-light text-espresso">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="border border-sand bg-white p-6">
        <h2 className="font-serif text-xl font-light text-espresso">
          Your trade benefits
        </h2>
        <p className="mt-2 text-sm text-walnut">
          {formatAccountType(accountType)} account with {discountPercent}% off
          retail pricing applied automatically at checkout.
        </p>
        <Link href="/pro/pricing" className="mt-4 inline-block text-sm text-walnut underline">
          View pricing details
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-light text-espresso">
            Recent orders
          </h2>
          <Link href="/pro/orders" className="text-sm text-walnut underline">
            View all
          </Link>
        </div>
        <OrdersList orders={overview.orders} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-light text-espresso">
            Recent quotes
          </h2>
          <Link href="/pro/quotes" className="text-sm text-walnut underline">
            View all
          </Link>
        </div>
        <QuotesList quotes={overview.quotes} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-light text-espresso">
            Recent samples
          </h2>
          <Link href="/pro/samples" className="text-sm text-walnut underline">
            View all
          </Link>
        </div>
        <SamplesList samples={overview.samples} />
      </section>
    </div>
  );
}
