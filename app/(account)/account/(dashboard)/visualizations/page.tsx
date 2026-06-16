import { VisualizationsList } from "@/components/account/visualizations-list";
import { getCustomerVisualizations } from "@/lib/account";
import { requireCustomer } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Visualizations",
};

export default async function VisualizationsPage() {
  const { customer } = await requireCustomer();
  const items = await getCustomerVisualizations(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Visualizations
      </h1>
      <VisualizationsList items={items} />
    </section>
  );
}
