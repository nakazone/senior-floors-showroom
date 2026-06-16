import Link from "next/link";
import { AccountEmptyState } from "@/components/account/account-empty-state";

type VisualizationRecord = Awaited<
  ReturnType<typeof import("@/lib/account").getCustomerVisualizations>
>[number];

interface VisualizationsListProps {
  items: VisualizationRecord[];
}

export function VisualizationsList({ items }: VisualizationsListProps) {
  if (items.length === 0) {
    return (
      <AccountEmptyState
        title="No saved visualizations"
        description="Use the room visualizer to preview floors in your space and save them here."
        actionHref="/visualizer"
        actionLabel="Open visualizer"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const productImage = item.product.images[0]?.url;

        return (
          <article
            key={item.id}
            className="overflow-hidden border border-sand bg-white"
          >
            <div
              className="h-40 bg-cream bg-cover bg-center"
              style={{ backgroundImage: `url(${item.roomImageUrl})` }}
            />
            <div className="flex items-center gap-4 p-4">
              <div
                className="h-14 w-14 shrink-0 bg-cream bg-cover bg-center"
                style={
                  productImage
                    ? { backgroundImage: `url(${productImage})` }
                    : undefined
                }
              />
              <div>
                <p className="font-serif text-lg text-espresso">
                  {item.product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.installDirection} install |{" "}
                  {item.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="mt-2 inline-block text-xs text-walnut underline"
                >
                  View product
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
