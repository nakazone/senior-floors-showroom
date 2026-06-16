import { CatalogView } from "@/components/catalog/catalog-view";
import { CatalogJsonLd } from "@/components/seo/catalog-json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;

const description = `Browse the full ${siteConfig.name} catalog of premium LVP and engineered hardwood flooring.`;

export const metadata = buildPageMetadata({
  title: "Shop Flooring",
  description,
  path: "/shop",
});

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <>
      <CatalogJsonLd
        name="Shop Flooring"
        description={description}
        path="/shop"
      />
      <CatalogView
        title="Find your"
        titleEmphasis="perfect floor"
        description="Filter by material, color, wear layer, installation type and more. Every result is shareable via URL."
        searchParams={params}
      />
    </>
  );
}
