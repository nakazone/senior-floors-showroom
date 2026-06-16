import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { CatalogJsonLd } from "@/components/seo/catalog-json-ld";
import { getCategoryBaseFilters } from "@/lib/catalog-filters";
import {
  buildPageMetadata,
  shopCategoryPages,
} from "@/lib/seo";

const categoryMeta: Record<string, { title: string; description: string }> = {
  "lvp-flooring": {
    title: "LVP Flooring",
    description:
      "Shop luxury vinyl plank flooring with waterproof cores, authentic wood looks and easy click-lock installation.",
  },
  "engineered-hardwood": {
    title: "Engineered Hardwood",
    description:
      "Premium engineered hardwood with real wood veneers, wide planks and lasting performance for luxury interiors.",
  },
  "luxury-vinyl-plank": {
    title: "Luxury Vinyl Plank",
    description:
      "Explore our luxury vinyl plank collections designed for high-traffic modern living.",
  },
  "waterproof-flooring": {
    title: "Waterproof Flooring",
    description:
      "Waterproof LVP and vinyl flooring ideal for kitchens, basements, mudrooms and pet-friendly homes.",
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return shopCategoryPages.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];

  if (!meta) {
    const title = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return buildPageMetadata({
      title,
      description: `Browse ${title} at ${category.replace(/-/g, " ")} collections.`,
      path: `/shop/${category}`,
    });
  }

  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/shop/${category}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const baseFilters = getCategoryBaseFilters(category);
  const meta = categoryMeta[category];
  const title =
    meta?.title ??
    category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      <CatalogJsonLd
        name={title}
        description={meta?.description ?? `Browse ${title} flooring.`}
        path={`/shop/${category}`}
      />
      <CatalogView
        title={title}
        description={meta?.description}
        baseFilters={baseFilters}
        lockedFilters={baseFilters}
        searchParams={query}
      />
    </>
  );
}
