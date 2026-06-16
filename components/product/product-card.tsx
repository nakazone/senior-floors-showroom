import Link from "next/link";
import type { Product } from "@/types";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { CompareToggleButton } from "@/components/product/compare-toggle-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images?.[0];

  return (
    <article className={cn("sf-card group relative overflow-hidden", className)}>
      <Link href={`/product/${product.slug}`} className="block no-underline">
        <div className="relative h-[260px] overflow-hidden bg-bg-light">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-secondary/30 to-primary/20" />
          )}
          {product.waterproof ? (
            <Badge className="absolute top-3.5 left-3.5 border-none bg-success text-white">
              Waterproof
            </Badge>
          ) : null}
          <CompareToggleButton product={product} variant="card" />
        </div>
        <div className="p-5 pb-3.5">
          <p className="mb-1 text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase">
            {product.series}
          </p>
          <h3 className="mb-1 text-lg font-bold text-text-dark">{product.name}</h3>
          <p className="text-xs leading-relaxed text-text-muted">
            {product.thickness} | {product.wearLayer} | {product.width}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-border px-5 pt-3.5 pb-5">
        <p className="text-xl font-bold text-text-dark">
          ${product.pricePerSqFt.toFixed(2)}
          <small className="ml-1 text-xs font-normal text-text-muted">/sq ft</small>
        </p>
        <div className="flex items-center gap-2">
          <AddToCartButton
            product={product}
            size="sm"
            label="Add"
            className="px-3"
          />
          <Link
            href={`/product/${product.slug}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
