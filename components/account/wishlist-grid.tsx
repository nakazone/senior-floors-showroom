import Link from "next/link";
import { formatCartCurrency } from "@/lib/cart";
import { AccountEmptyState } from "@/components/account/account-empty-state";

type WishlistRecord = Awaited<
  ReturnType<typeof import("@/lib/account").getCustomerWishlist>
>[number];

interface WishlistGridProps {
  items: WishlistRecord[];
}

export function WishlistGrid({ items }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <AccountEmptyState
        title="Your wishlist is empty"
        description="Save floors you love while browsing the catalog."
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => {
        const imageUrl = item.product.images[0]?.url;
        const variant = item.product.variants[0];

        return (
          <Link
            key={item.id}
            href={`/product/${item.product.slug}`}
            className="block border border-sand bg-white p-3 no-underline transition-colors hover:border-espresso"
          >
            <div
              className="mb-3 h-20 bg-cream bg-cover bg-center"
              style={
                imageUrl
                  ? { backgroundImage: `url(${imageUrl})` }
                  : variant?.hexPrimary && variant?.hexSecondary
                    ? {
                        background: `linear-gradient(135deg, ${variant.hexPrimary}, ${variant.hexSecondary})`,
                      }
                    : undefined
              }
            />
            <p className="font-serif text-sm text-espresso">{item.product.name}</p>
            <p className="mt-1 text-xs text-gold">
              {formatCartCurrency(Number(item.product.pricePerSqFt))}/sq ft
            </p>
          </Link>
        );
      })}
    </div>
  );
}
