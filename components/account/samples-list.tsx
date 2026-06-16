import Link from "next/link";
import { AccountEmptyState } from "@/components/account/account-empty-state";
import { StatusBadge } from "@/components/account/status-badge";

type SampleRecord = Awaited<
  ReturnType<typeof import("@/lib/account").getCustomerSampleRequests>
>[number];

interface SamplesListProps {
  samples: SampleRecord[];
}

export function SamplesList({ samples }: SamplesListProps) {
  if (samples.length === 0) {
    return (
      <AccountEmptyState
        title="No sample requests"
        description="Order up to 3 free samples and track delivery status here."
        actionHref="/samples"
        actionLabel="Order samples"
      />
    );
  }

  return (
    <div className="space-y-3">
      {samples.map((request) => {
        const names = request.items.map((item) => item.product.name).join(", ");

        return (
          <article
            key={request.id}
            className="flex flex-col gap-3 border border-sand bg-bone p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-serif text-lg text-espresso">{names}</p>
              <p className="text-xs text-muted-foreground">
                Requested{" "}
                {request.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" | "}
                {request.isPaid ? "Paid" : "Free"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={request.status} />
              {request.items[0] ? (
                <Link
                  href={`/product/${request.items[0].product.slug}`}
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
