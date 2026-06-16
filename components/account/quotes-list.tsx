import Link from "next/link";
import { formatCartCurrency } from "@/lib/cart";
import { parseQuoteItems } from "@/lib/account";
import { AccountEmptyState } from "@/components/account/account-empty-state";
import { StatusBadge } from "@/components/account/status-badge";

type QuoteRecord = Awaited<
  ReturnType<typeof import("@/lib/account").getCustomerQuotes>
>[number];

interface QuotesListProps {
  quotes: QuoteRecord[];
}

export function QuotesList({ quotes }: QuotesListProps) {
  if (quotes.length === 0) {
    return (
      <AccountEmptyState
        title="No saved quotes"
        description="Use the floor calculator on any product page and save your estimate here."
        actionHref="/shop"
        actionLabel="Find a floor"
      />
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote) => {
        const items = parseQuoteItems(quote.items);
        const firstProduct = items.products?.[0];

        return (
          <article
            key={quote.id}
            className="flex flex-col gap-3 border border-sand bg-bone p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-serif text-lg text-espresso">
                {firstProduct?.name ?? "Saved quote"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCartCurrency(Number(quote.totalEstimate))}
                {firstProduct?.sqFt
                  ? ` | ${firstProduct.sqFt.toFixed(1)} sq ft`
                  : ""}
                {" | Expires "}
                {quote.expiresAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={quote.status} />
              {firstProduct?.slug ? (
                <Link
                  href={`/product/${firstProduct.slug}`}
                  className="text-xs text-walnut underline"
                >
                  View product
                </Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
