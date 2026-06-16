import Link from "next/link";
import { StatusBadge } from "@/components/account/status-badge";

interface ProApplicationStatusProps {
  status: "pending" | "rejected";
  email: string;
}

export function ProApplicationStatus({
  status,
  email,
}: ProApplicationStatusProps) {
  return (
    <div className="border border-sand bg-white p-8 md:p-10">
      <StatusBadge status={status === "pending" ? "PENDING" : "CANCELLED"} />
      <h2 className="mt-4 font-serif text-2xl font-light text-espresso">
        {status === "pending"
          ? "Application under review"
          : "Application not approved"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-walnut">
        {status === "pending" ? (
          <>
            We received your trade application for{" "}
            <span className="text-espresso">{email}</span>. A member of our
            trade team will reach out within 1-2 business days.
          </>
        ) : (
          <>
            Your previous application was not approved. Contact our trade desk if
            you would like to discuss eligibility or submit updated credentials.
          </>
        )}
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/professionals" className="btn-outline no-underline">
          Back to program
        </Link>
        {status === "rejected" ? (
          <Link href="/pro/apply" className="btn-dark no-underline">
            Reapply
          </Link>
        ) : null}
      </div>
    </div>
  );
}
