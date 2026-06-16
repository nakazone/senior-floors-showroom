import { CalculatorTool } from "@/components/tools/calculator-tool";
import { SiteLayout } from "@/components/layout/site-layout";
import { createPlaceholderMetadata } from "@/components/shared/placeholder-page";
import { searchCatalogProducts } from "@/lib/products";

export const metadata = createPlaceholderMetadata(
  "Floor Calculator",
  "Calculate square footage, boxes needed and total cost for your flooring project.",
);

export default async function CalculatorToolPage() {
  const products = await searchCatalogProducts({});

  const calculatorProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    pricePerSqFt: product.pricePerSqFt,
    boxCoverageSqFt: product.boxCoverageSqFt,
  }));

  return (
    <SiteLayout>
      <main className="section-padding bg-white pt-[calc(var(--nav-height)+2rem)]">
        <div className="section-inner max-w-2xl">
          <span className="eyebrow">Tools</span>
          <h1 className="display-heading mb-8">
            Floor <em>calculator</em>
          </h1>
          <p className="mb-8 text-walnut">
            Choose a product, enter your room dimensions, and get an estimate
            with 10% waste included. Save quotes when you are signed in.
          </p>
          <CalculatorTool products={calculatorProducts} />
        </div>
      </main>
    </SiteLayout>
  );
}
