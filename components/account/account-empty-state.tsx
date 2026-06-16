import Link from "next/link";

interface AccountEmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AccountEmptyState({
  title,
  description,
  actionHref = "/shop",
  actionLabel = "Browse flooring",
}: AccountEmptyStateProps) {
  return (
    <div className="border border-sand bg-bone p-10 text-center">
      <h2 className="mb-2 font-serif text-xl text-espresso">{title}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      <Link
        href={actionHref}
        className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
