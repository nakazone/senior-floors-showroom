import { QuotesList } from "@/components/account/quotes-list";
import { getCustomerQuotes } from "@/lib/account";
import { requireApprovedPro } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Quotes",
};

export default async function ProQuotesPage() {
  const { customer } = await requireApprovedPro();
  const quotes = await getCustomerQuotes(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Quotes
      </h1>
      <QuotesList quotes={quotes} />
    </section>
  );
}
