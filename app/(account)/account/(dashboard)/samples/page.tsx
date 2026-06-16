import { SamplesList } from "@/components/account/samples-list";
import { getCustomerSampleRequests } from "@/lib/account";
import { requireCustomer } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Samples",
};

export default async function AccountSamplesPage() {
  const { customer } = await requireCustomer();
  const samples = await getCustomerSampleRequests(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Samples
      </h1>
      <SamplesList samples={samples} />
    </section>
  );
}
