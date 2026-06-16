"use client";

import { useState } from "react";
import { trackGenerateLead } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      trackGenerateLead("newsletter");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <section className="bg-espresso px-6 py-20 text-center md:px-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 font-serif text-4xl font-light text-bone md:text-[44px]">
          Stay <em className="text-gold not-italic">inspired</em>
        </h2>
        <p className="mb-8 text-[15px] text-bone/50">
          New arrivals, exclusive deals and design ideas - delivered monthly.
        </p>

        {status === "success" ? (
          <p className="text-sm text-gold-light">
            Subscribed! Welcome to {siteConfig.name}.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-[480px] flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              className="flex-1 border border-bone/15 bg-bone/8 px-5 py-3.5 text-sm text-bone outline-none placeholder:text-bone/35 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-gold min-h-11 shrink-0 px-7 py-3.5 text-sm disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
