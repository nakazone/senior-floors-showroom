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
    <section className="bg-primary px-4 py-16 text-center sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="display-heading mb-2 text-white">
          Stay <em>inspired</em>
        </h2>
        <p className="mb-8 text-[15px] text-white/75">
          New arrivals, exclusive deals and design ideas from {siteConfig.name}.
        </p>

        {status === "success" ? (
          <p className="text-sm text-secondary">Subscribed! Welcome to {siteConfig.name}.</p>
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
              className="flex-1 rounded-md border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/45 focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/40"
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
