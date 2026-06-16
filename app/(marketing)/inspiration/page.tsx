import { Suspense } from "react";
import { InspirationGalleryView } from "@/components/inspiration/inspiration-gallery-view";
import {
  getInspirationGalleryItems,
  parseGallerySearchParams,
} from "@/lib/gallery";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Inspiration Gallery",
  description: `Browse real-room installations and discover the perfect floor for your space at ${siteConfig.name}.`,
  path: "/inspiration",
});

interface InspirationPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function InspirationPage({
  searchParams,
}: InspirationPageProps) {
  const params = await searchParams;
  const filters = parseGallerySearchParams(params);
  const items = await getInspirationGalleryItems(filters);

  return (
    <main className="section-padding bg-bone pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow">Inspiration Gallery</span>
        <h1 className="display-heading mb-4">
          Real rooms, <em>real floors</em>
        </h1>
        <p className="mb-10 max-w-2xl text-walnut">
          Explore installed spaces across living rooms, bedrooms, kitchens and
          more. Filter by room or design style to find looks you love.
        </p>

        <Suspense>
          <InspirationGalleryView items={items} />
        </Suspense>
      </div>
    </main>
  );
}
