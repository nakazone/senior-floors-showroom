import { AccountNav } from "@/components/account/account-nav";
import { requireCustomer } from "@/lib/auth";

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer } = await requireCustomer();

  return (
    <main className="section-padding bg-cream pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <AccountNav
            customerName={customer.name}
            customerEmail={customer.email}
          />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
