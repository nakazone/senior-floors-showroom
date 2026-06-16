"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSampleStore } from "@/lib/stores/sample-store";

interface SampleSuccessViewProps {
  sessionId: string;
}

type SampleSessionSummary = {
  sessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  request: {
    id: string;
    items: Array<{ name: string; slug: string }>;
  } | null;
};

export function SampleSuccessView({ sessionId }: SampleSuccessViewProps) {
  const clearAll = useSampleStore((state) => state.clearAll);
  const [summary, setSummary] = useState<SampleSessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearAll();
  }, [clearAll]);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await response.json()) as {
          sessionId: string;
          customerEmail: string | null;
          amountTotal: number;
          order: null;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to verify payment");
        }

        const requestResponse = await fetch(
          `/api/samples/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const requestData = (await requestResponse.json()) as {
          request: SampleSessionSummary["request"];
        };

        if (!cancelled) {
          setSummary({
            sessionId: data.sessionId,
            customerEmail: data.customerEmail,
            amountTotal: data.amountTotal,
            request: requestData.request ?? null,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to verify sample payment",
          );
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (error) {
    return (
      <div className="border border-sand bg-white p-10 text-center">
        <h2 className="mb-3 font-serif text-3xl font-light text-espresso">
          Payment received
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Your sample payment went through. We will email shipping updates soon.
        </p>
        <Link
          href="/account/samples"
          className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
        >
          View sample requests
        </Link>
      </div>
    );
  }

  if (!summary) {
    return <div className="min-h-[240px] animate-pulse bg-cream/50" />;
  }

  return (
    <div className="border border-sand bg-white p-8">
      <span className="eyebrow">Sample Program</span>
      <h2 className="display-heading mb-4">
        Samples <em>confirmed</em>
      </h2>
      <p className="mb-6 max-w-xl text-walnut">
        {summary.customerEmail
          ? `We will ship your samples to ${summary.customerEmail} within 2-4 business days.`
          : "Your samples will ship within 2-4 business days."}
      </p>

      {summary.request?.items.length ? (
        <ul className="mb-8 space-y-3 border-t border-cream pt-6">
          {summary.request.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/product/${item.slug}`}
                className="font-serif text-lg text-espresso no-underline hover:text-walnut"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
        >
          Continue shopping
        </Link>
        <Link
          href="/account/samples"
          className="inline-block border border-espresso px-6 py-3 text-sm tracking-wide text-espresso uppercase no-underline"
        >
          View my samples
        </Link>
      </div>
    </div>
  );
}
