import Link from "next/link";
import { formatAccountType, PRO_PERKS_BY_TYPE } from "@/lib/pro";
import type { AccountType } from "@/types";

interface ProPricingCardProps {
  accountType: AccountType;
  discountPercent: number;
}

export function ProPricingCard({
  accountType,
  discountPercent,
}: ProPricingCardProps) {
  const perks =
    accountType !== "RETAIL"
      ? PRO_PERKS_BY_TYPE[accountType]
      : ["Retail pricing applies"];

  return (
    <div className="space-y-6">
      <section className="border border-sand bg-white p-6 md:p-8">
        <p className="text-[11px] tracking-[0.18em] text-gold uppercase">
          Volume pricing
        </p>
        <h2 className="mt-2 font-serif text-3xl font-light text-espresso">
          {discountPercent}% trade discount
        </h2>
        <p className="mt-3 text-sm text-walnut">
          Your {formatAccountType(accountType).toLowerCase()} account receives{" "}
          {discountPercent}% off retail pricing on every order. Discounts are
          applied automatically when you check out while signed in.
        </p>
      </section>

      <section className="border border-sand bg-bone p-6 md:p-8">
        <h3 className="font-serif text-xl font-light text-espresso">
          Program perks
        </h3>
        <ul className="mt-4 space-y-2">
          {perks.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-2 text-sm text-walnut"
            >
              <span className="text-gold">?</span>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-sand bg-white p-6 md:p-8">
        <h3 className="font-serif text-xl font-light text-espresso">
          Need a project quote?
        </h3>
        <p className="mt-2 text-sm text-walnut">
          Use the floor calculator on any product page to save estimates, or
          contact our trade desk for multi-unit pricing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-dark no-underline">
            Browse catalog
          </Link>
          <Link href="/pro/quotes" className="btn-outline no-underline">
            View saved quotes
          </Link>
        </div>
      </section>
    </div>
  );
}
