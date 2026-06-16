import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import type { SeoFilterPage } from "@/types";
import { categorySlugFilters } from "@/types/catalog";
import { siteConfig } from "@/lib/siteConfig";

export const SEO_REVALIDATE_SECONDS = 3600;

export type SeoFilterRoute = "color" | "style" | "room";

export interface SeoFilterPageConfig extends SeoFilterPage {
  route: SeoFilterRoute;
}

export const colorFilterPages: SeoFilterPageConfig[] = [
  {
    route: "color",
    slug: "light-oak",
    title: "Light Oak Flooring",
    description:
      "Browse light oak LVP and engineered hardwood floors with airy, sun-washed tones for modern interiors.",
    filterKey: "colorFamily",
    filterValue: "light-oak",
  },
  {
    route: "color",
    slug: "white-oak",
    title: "White Oak Flooring",
    description:
      "Shop white oak flooring collections with clean grain patterns and timeless neutral palettes.",
    filterKey: "colorFamily",
    filterValue: "white-oak",
  },
  {
    route: "color",
    slug: "natural",
    title: "Natural Tone Flooring",
    description:
      "Explore natural wood-look floors that balance warmth and versatility across every room.",
    filterKey: "colorFamily",
    filterValue: "natural",
  },
  {
    route: "color",
    slug: "brown",
    title: "Brown and Walnut Flooring",
    description:
      "Rich brown and walnut flooring options for layered, grounded interior design.",
    filterKey: "colorFamily",
    filterValue: "brown",
  },
  {
    route: "color",
    slug: "dark",
    title: "Dark and Espresso Flooring",
    description:
      "Dramatic dark and espresso floors for bold contrast and luxury styling.",
    filterKey: "colorFamily",
    filterValue: "dark",
  },
];

export const styleFilterPages: SeoFilterPageConfig[] = [
  {
    route: "style",
    slug: "modern",
    title: "Modern Flooring",
    description:
      "Clean lines, wide planks and refined finishes for contemporary spaces.",
    filterKey: "style",
    filterValue: "modern",
  },
  {
    route: "style",
    slug: "contemporary",
    title: "Contemporary Flooring",
    description:
      "Balanced textures and versatile tones for updated, design-forward homes.",
    filterKey: "style",
    filterValue: "contemporary",
  },
  {
    route: "style",
    slug: "farmhouse",
    title: "Farmhouse Flooring",
    description:
      "Warm wood looks and rustic character for relaxed, welcoming interiors.",
    filterKey: "style",
    filterValue: "farmhouse",
  },
  {
    route: "style",
    slug: "scandinavian",
    title: "Scandinavian Flooring",
    description:
      "Light, minimal flooring palettes inspired by Nordic calm and clarity.",
    filterKey: "style",
    filterValue: "scandinavian",
  },
  {
    route: "style",
    slug: "luxury",
    title: "Luxury Flooring",
    description:
      "Premium planks and elevated finishes for high-end residential projects.",
    filterKey: "style",
    filterValue: "luxury",
  },
];

export const roomFilterPages: SeoFilterPageConfig[] = [
  {
    route: "room",
    slug: "living-room",
    title: "Living Room Flooring",
    description:
      "Durable, design-led floors built for everyday living room traffic and comfort.",
    filterKey: "rooms",
    filterValue: "living-room",
  },
  {
    route: "room",
    slug: "bedroom",
    title: "Bedroom Flooring",
    description:
      "Soft-underfoot wood and vinyl looks that create a calm bedroom retreat.",
    filterKey: "rooms",
    filterValue: "bedroom",
  },
  {
    route: "room",
    slug: "basement",
    title: "Basement Flooring",
    description:
      "Moisture-conscious flooring options ideal for finished basement spaces.",
    filterKey: "rooms",
    filterValue: "basement",
  },
  {
    route: "room",
    slug: "kitchen",
    title: "Kitchen Flooring",
    description:
      "Water-resistant kitchen flooring that stands up to spills, pets and daily use.",
    filterKey: "rooms",
    filterValue: "kitchen",
  },
  {
    route: "room",
    slug: "office",
    title: "Office Flooring",
    description:
      "Polished, low-maintenance floors for productive home offices and studios.",
    filterKey: "rooms",
    filterValue: "office",
  },
];

export const shopCategoryPages = Object.keys(categorySlugFilters).map(
  (slug) => ({
    slug,
    path: `/shop/${slug}`,
  }),
);

export const publicStaticPages = [
  "/",
  "/shop",
  "/about",
  "/inspiration",
  "/samples",
  "/compare",
  "/ai-finder",
  "/visualizer",
  "/professionals",
  "/pro/apply",
  "/tools/calculator",
] as const;

const allFilterPages = [
  ...colorFilterPages,
  ...styleFilterPages,
  ...roomFilterPages,
];

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteConfig.url).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: siteConfig.name,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export const privateRouteMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export function getSeoFilterPage(route: SeoFilterRoute, slug: string) {
  const pages =
    route === "color"
      ? colorFilterPages
      : route === "style"
        ? styleFilterPages
        : roomFilterPages;

  return pages.find((page) => page.slug === slug) ?? null;
}

export function getSeoFilterBaseFilters(page: SeoFilterPageConfig) {
  if (page.filterKey === "colorFamily") {
    return { colorFamily: page.filterValue };
  }
  if (page.filterKey === "style") {
    return { style: page.filterValue };
  }
  if (page.filterKey === "rooms") {
    return { room: page.filterValue };
  }
  if (page.filterKey === "type") {
    return { type: page.filterValue as "LVP" | "ENGINEERED" | "HARDWOOD" };
  }
  if (page.filterKey === "waterproof") {
    return { waterproof: true };
  }
  return {};
}

export function getSitemapEntries(
  products: Array<{ slug: string; updatedAt?: Date }> = [],
): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = publicStaticPages.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  for (const category of shopCategoryPages) {
    entries.push({
      url: absoluteUrl(category.path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const page of allFilterPages) {
    entries.push({
      url: absoluteUrl(`/${page.route}/${page.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const product of products) {
    entries.push({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: product.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return entries;
}
