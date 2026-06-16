import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-cream bg-white py-16 md:py-24">
      <div className="section-inner">
        <span className="eyebrow">You May Also Like</span>
        <h2 className="display-heading mb-10">
          Related <em>floors</em>
        </h2>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
