import { ProNav } from "@/components/pro/pro-nav";
import { requireApprovedPro } from "@/lib/auth";
import { getProDiscountPercent } from "@/lib/pro";

export default async function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer } = await requireApprovedPro();
  const discountPercent = getProDiscountPercent(customer);

  return (
    <main className="section-padding bg-cream pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <ProNav
            customerName={customer.name}
            customerEmail={customer.email}
            accountType={customer.accountType}
            discountPercent={discountPercent}
          />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
