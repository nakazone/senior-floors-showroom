import { WishlistGrid } from "@/components/account/wishlist-grid";
import { getCustomerWishlist } from "@/lib/account";
import { requireCustomer } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const { customer } = await requireCustomer();
  const items = await getCustomerWishlist(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Wishlist
      </h1>
      <WishlistGrid items={items} />
    </section>
  );
}
