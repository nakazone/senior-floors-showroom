import { SamplesPageView } from "@/components/samples/samples-page-view";
import { searchCatalogProducts } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Samples",
  description: `Order flooring samples in a 3- or 5-sample box from ${siteConfig.name}.`,
};

interface SamplesPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function SamplesPage({ searchParams }: SamplesPageProps) {
  const { product: initialSlug } = await searchParams;
  const products = await searchCatalogProducts({});

  return (
    <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow">Sample Program</span>
        <h1 className="display-heading mb-8">
          Touch before <em>you decide</em>
        </h1>
        <SamplesPageView products={products} initialSlug={initialSlug} />
      </div>
    </main>
  );
}
