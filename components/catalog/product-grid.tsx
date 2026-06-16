import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border border-sand bg-bone px-8 py-16 text-center">
        <h2 className="mb-2 font-serif text-2xl font-light text-espresso">
          No floors match your filters
        </h2>
        <p className="text-sm text-walnut">
          Try adjusting your filters or browse the full catalog.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3"
      role="list"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
