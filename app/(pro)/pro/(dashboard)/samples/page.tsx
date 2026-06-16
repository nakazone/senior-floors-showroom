import { SamplesList } from "@/components/account/samples-list";
import { getCustomerSampleRequests } from "@/lib/account";
import { requireApprovedPro } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Samples",
};

export default async function ProSamplesPage() {
  const { customer } = await requireApprovedPro();
  const samples = await getCustomerSampleRequests(customer.id);

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-light text-espresso">
        Samples
      </h1>
      <p className="mb-6 text-sm text-walnut">
        Trade partners receive unlimited sample requests as part of the pro
        program.
      </p>
      <SamplesList samples={samples} />
    </section>
  );
}
