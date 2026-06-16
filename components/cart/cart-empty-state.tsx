import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartEmptyState() {
  return (
    <div className="px-4 py-16 text-center">
      <ShoppingBag
        className="mx-auto mb-4 h-10 w-10 text-muted-foreground"
        strokeWidth={1.25}
      />
      <h4 className="mb-2 font-serif text-xl font-normal text-walnut">
        Your cart is empty
      </h4>
      <p className="mb-6 text-sm text-muted-foreground">
        Add a floor to get started.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline transition-colors hover:bg-walnut"
      >
        Browse Flooring
      </Link>
    </div>
  );
}
