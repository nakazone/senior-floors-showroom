import Link from "next/link";
import { formatCartCurrency } from "@/lib/cart";
import { AccountEmptyState } from "@/components/account/account-empty-state";
import { StatusBadge } from "@/components/account/status-badge";

type OrderRecord = Awaited<
  ReturnType<typeof import("@/lib/account").getCustomerOrders>
>[number];

interface OrdersListProps {
  orders: OrderRecord[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <AccountEmptyState
        title="No orders yet"
        description="When you complete a purchase, your order history will appear here."
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const primaryItem = order.items[0];
        const imageUrl = primaryItem?.product.images[0]?.url;
        const sqFtTotal = order.items.reduce(
          (total, item) => total + Number(item.sqFt),
          0,
        );

        return (
          <article
            key={order.id}
            className="flex flex-col gap-4 border border-sand bg-bone p-4 sm:flex-row sm:items-center"
          >
            <div
              className="h-14 w-[72px] shrink-0 bg-cream bg-cover bg-center"
              style={
                imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined
              }
            />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-espresso">
                {primaryItem?.product.name ?? "Flooring order"}
                {order.items.length > 1
                  ? ` + ${order.items.length - 1} more`
                  : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Order {order.id.slice(0, 8).toUpperCase()} |{" "}
                {sqFtTotal.toFixed(1)} sq ft | {formatCartCurrency(Number(order.total))} |{" "}
                {order.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <StatusBadge status={order.status} />
              {primaryItem ? (
                <Link
                  href={`/product/${primaryItem.product.slug}`}
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
