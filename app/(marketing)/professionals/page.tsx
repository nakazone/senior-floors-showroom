import Link from "next/link";
import { ProTradeCards } from "@/components/pro/pro-trade-cards";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;
export const metadata = buildPageMetadata({
  title: "For Professionals",
  description: `Trade pricing, volume perks and project tools for contractors, designers and builders at ${siteConfig.name}.`,
  path: "/professionals",
});

export default function ProfessionalsPage() {
  return (
    <main>
      <section className="section-padding bg-espresso pt-[calc(var(--nav-height)+2rem)]">
        <div className="section-inner">
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="eyebrow">For Professionals</span>
            <h1 className="display-heading text-bone">
              Trade <em>pricing</em> and volume perks
            </h1>
            <p className="mt-4 text-bone/60">
              Join the Senior Floors Pro program for dedicated trade support,
              project tools and exclusive volume pricing.
            </p>
          </div>

          <ProTradeCards />
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="section-inner max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-light text-espresso">
            Already a trade partner?
          </h2>
          <p className="mt-3 text-walnut">
            Sign in to access your pro dashboard, track projects and shop with
            your trade discount.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/pro/dashboard" className="btn-dark no-underline">
              Pro dashboard
            </Link>
            <Link href="/pro/apply" className="btn-outline no-underline">
              Apply for trade pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
