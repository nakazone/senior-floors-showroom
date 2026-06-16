import type { Metadata } from "next";
import { HeroVideo } from "@/components/home/hero-video";
import { MarqueeBar } from "@/components/home/marquee-bar";
import { HomeCatalogSection } from "@/components/home/home-catalog-section";
import {
  HomeSampleProgramBlock,
  HomeVisualizerBlock,
} from "@/components/home/home-feature-tools-section";
import { HomeAiFinderSection } from "@/components/home/home-ai-finder-section";
import { SocialProof } from "@/components/home/social-proof";
import { InspirationPreview } from "@/components/home/inspiration-preview";
import { HomeJsonLd } from "@/components/home/home-json-ld";
import {
  getHomeAggregateRating,
  getHomeGalleryItems,
  getHomeReviews,
} from "@/lib/home";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Home",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [reviews, galleryItems, aggregate] = await Promise.all([
    getHomeReviews(4),
    getHomeGalleryItems(6),
    getHomeAggregateRating(),
  ]);

  return (
    <>
      <HomeJsonLd
        ratingValue={aggregate.ratingValue}
        reviewCount={aggregate.reviewCount}
      />
      <main>
        <HeroVideo />
        <MarqueeBar />
        <HomeCatalogSection />
        <HomeVisualizerBlock />
        <HomeAiFinderSection />
        <HomeSampleProgramBlock />
        <SocialProof
          reviews={reviews}
          ratingValue={aggregate.ratingValue}
          reviewCount={aggregate.reviewCount}
        />
        <InspirationPreview items={galleryItems} />
      </main>
    </>
  );
}
