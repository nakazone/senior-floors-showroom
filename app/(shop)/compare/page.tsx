import { ComparePageView } from "@/components/compare/compare-page-view";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Floors",
  description: `Side-by-side comparison of up to 4 flooring products at ${siteConfig.name}.`,
};

export default function ComparePage() {
  return (
    <main className="section-padding bg-cream pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow">Compare Floors</span>
        <h1 className="display-heading mb-8">
          Compare <em>floors</em>
        </h1>
        <ComparePageView />
      </div>
    </main>
  );
}
