import Link from "next/link";
import { SampleSuccessView } from "@/components/samples/sample-success-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samples Confirmed",
  description: "Your flooring sample request has been confirmed.",
};

interface SampleSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SampleSuccessPage({
  searchParams,
}: SampleSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-3xl">
        {sessionId ? (
          <SampleSuccessView sessionId={sessionId} />
        ) : (
          <div className="border border-sand bg-white p-10 text-center">
            <h1 className="mb-4 font-serif text-3xl font-light text-espresso">
              Samples requested
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Your sample order is confirmed. Check your email for updates.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
