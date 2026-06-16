import { FloorFinderChat } from "@/components/ai-finder/floor-finder-chat";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Floor Finder",
  description: `Answer a few questions and get personalized flooring recommendations from ${siteConfig.name}.`,
};

export default function AiFinderPage() {
  return (
    <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-3xl">
        <div className="mb-10 text-center">
          <span className="eyebrow">AI Floor Finder</span>
          <h1 className="display-heading mb-4">
            Let AI find your <em>ideal floor</em>
          </h1>
          <p className="mx-auto max-w-xl text-walnut">
            Answer a few questions and our AI recommends the perfect flooring for
            your lifestyle, room and budget.
          </p>
        </div>
        <FloorFinderChat />
      </div>
    </main>
  );
}
