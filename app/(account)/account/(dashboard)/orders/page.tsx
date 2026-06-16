import { OrdersList } from "@/components/account/orders-list";
import { getCustomerOrders } from "@/lib/account";
import { requireCustomer } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const { customer } = await requireCustomer();
  const orders = await getCustomerOrders(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Orders
      </h1>
      <OrdersList orders={orders} />
    </section>
  );
}
