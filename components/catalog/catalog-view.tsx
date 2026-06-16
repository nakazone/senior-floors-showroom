import Link from "next/link";
import { Suspense } from "react";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { parseCatalogSearchParams } from "@/lib/catalog-filters";
import { getCatalogFacets, searchCatalogProducts } from "@/lib/products";
import type { CatalogFilters as CatalogFiltersType } from "@/types/catalog";
import type { Product } from "@/types";

interface CatalogViewProps {
  title: string;
  titleEmphasis?: string;
  description?: string;
  baseFilters?: Partial<CatalogFiltersType>;
  lockedFilters?: Partial<CatalogFiltersType>;
  searchParams: Record<string, string | string[] | undefined>;
}

function FiltersFallback() {
  return (
    <div className="mb-10 h-24 animate-pulse border-b border-cream bg-cream/40" />
  );
}

export async function CatalogView({
  title,
  titleEmphasis,
  description,
  baseFilters = {},
  lockedFilters = {},
  searchParams,
}: CatalogViewProps) {
  const filters = parseCatalogSearchParams(searchParams, {
    ...baseFilters,
    ...lockedFilters,
  });

  const [facets, products] = await Promise.all([
    getCatalogFacets(),
    searchCatalogProducts(filters),
  ]);

  return (
    <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <span className="eyebrow">Full Catalog</span>
            <h1 className="display-heading">
              {title}
              {titleEmphasis ? (
                <>
                  {" "}
                  <em>{titleEmphasis}</em>
                </>
              ) : null}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-walnut">{description}</p>
            ) : null}
          </div>
          <Link href="/compare" className="btn-outline shrink-0 no-underline">
            Compare Floors
          </Link>
        </div>

        <Suspense fallback={<FiltersFallback />}>
          <CatalogFilters facets={facets} lockedFilters={lockedFilters} />
        </Suspense>

        <CatalogResults
          count={products.length}
          products={products}
          query={filters.query}
        />
      </div>
    </main>
  );
}

function CatalogResults({
  count,
  products,
  query,
}: {
  count: number;
  products: Product[];
  query?: string;
}) {
  return (
    <>
      <p className="mb-6 text-sm text-walnut">
        Showing <strong className="font-medium text-espresso">{count}</strong>{" "}
        {count === 1 ? "floor" : "floors"}
        {query ? (
          <>
            {" "}
            for <strong className="font-medium text-espresso">&quot;{query}&quot;</strong>
          </>
        ) : null}
      </p>
      <ProductGrid products={products} />
    </>
  );
}
