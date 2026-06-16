import { CatalogView } from "@/components/catalog/catalog-view";
import { CatalogJsonLd } from "@/components/seo/catalog-json-ld";
import {
  getSeoFilterBaseFilters,
  type SeoFilterPageConfig,
} from "@/lib/seo";

interface SeoFilterCatalogProps {
  page: SeoFilterPageConfig;
  searchParams: Record<string, string | string[] | undefined>;
}

export function SeoFilterCatalog({ page, searchParams }: SeoFilterCatalogProps) {
  const baseFilters = getSeoFilterBaseFilters(page);
  const path = `/${page.route}/${page.slug}`;

  return (
    <>
      <CatalogJsonLd
        name={page.title}
        description={page.description}
        path={path}
      />
      <CatalogView
        title={page.title.replace(" Flooring", "")}
        titleEmphasis="flooring"
        description={page.description}
        baseFilters={baseFilters}
        lockedFilters={baseFilters}
        searchParams={searchParams}
      />
    </>
  );
}
