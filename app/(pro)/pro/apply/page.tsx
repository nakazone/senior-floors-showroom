import Link from "next/link";
import { redirect } from "next/navigation";
import { ProApplicationStatus } from "@/components/pro/pro-application-status";
import { ProApplyForm } from "@/components/pro/pro-apply-form";
import { getProApplicationState } from "@/lib/auth";
import type { AccountType } from "@/types";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Application",
  description: `Apply for trade pricing as a contractor, designer or builder at ${siteConfig.name}.`,
};

const validTypes = new Set(["CONTRACTOR", "DESIGNER", "BUILDER"]);

interface ProApplyPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProApplyPage({ searchParams }: ProApplyPageProps) {
  const params = await searchParams;
  const typeParam = typeof params.type === "string" ? params.type : undefined;
  const defaultAccountType =
    typeParam && validTypes.has(typeParam)
      ? (typeParam as Exclude<AccountType, "RETAIL">)
      : "CONTRACTOR";

  const application = await getProApplicationState();

  if (application.state === "approved") {
    redirect("/pro/dashboard");
  }

  return (
    <main className="section-padding bg-cream pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-2xl">
        <span className="eyebrow">Pro Application</span>
        <h1 className="display-heading mb-4">
          Join the <em>trade program</em>
        </h1>
        <p className="mb-8 text-walnut">
          Apply for volume pricing, dedicated support and project tools tailored
          to your trade.
        </p>

        {application.state === "anonymous" ? (
          <div className="border border-sand bg-white p-8">
            <p className="text-sm text-walnut">
              Sign in to submit your trade application and track approval status.
            </p>
            <Link
              href={`/account/login?redirect=${encodeURIComponent("/pro/apply")}`}
              className="btn-dark mt-6 inline-block no-underline"
            >
              Sign in to apply
            </Link>
          </div>
        ) : application.state === "pending" ? (
          <ProApplicationStatus
            status="pending"
            email={application.customer.email}
          />
        ) : application.state === "rejected" ? (
          <div className="space-y-6">
            <ProApplicationStatus
              status="rejected"
              email={application.customer.email}
            />
            <ProApplyForm
              defaultAccountType={defaultAccountType}
              defaultContactName={application.customer.name}
              defaultEmail={application.customer.email}
            />
          </div>
        ) : (
          <ProApplyForm
            defaultAccountType={defaultAccountType}
            defaultContactName={application.customer.name}
            defaultEmail={application.customer.email}
          />
        )}
      </div>
    </main>
  );
}
