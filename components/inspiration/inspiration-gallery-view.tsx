import { Suspense } from "react";
import type { InspirationGalleryItem } from "@/lib/gallery";
import { GalleryFiltersBar } from "@/components/inspiration/gallery-filters";
import { GalleryMasonry } from "@/components/inspiration/gallery-masonry";

interface InspirationGalleryViewProps {
  items: InspirationGalleryItem[];
}

function FiltersFallback() {
  return <div className="mb-10 h-24 animate-pulse bg-cream/50" />;
}

export function InspirationGalleryView({ items }: InspirationGalleryViewProps) {
  return (
    <>
      <Suspense fallback={<FiltersFallback />}>
        <GalleryFiltersBar />
      </Suspense>
      <GalleryMasonry items={items} />
    </>
  );
}
