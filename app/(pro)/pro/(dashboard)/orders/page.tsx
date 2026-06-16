import { OrdersList } from "@/components/account/orders-list";
import { getCustomerOrders } from "@/lib/account";
import { requireApprovedPro } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Orders",
};

export default async function ProOrdersPage() {
  const { customer } = await requireApprovedPro();
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
