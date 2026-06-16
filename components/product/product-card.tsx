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
    <article
      className={cn(
        "group relative bg-bone transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <Link href={`/product/${product.slug}`} className="block no-underline">
        <div className="relative h-[260px] overflow-hidden bg-cream">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gold-light/40 to-walnut/30" />
          )}
          {product.waterproof ? (
            <Badge className="absolute top-3.5 left-3.5 border-none bg-sage text-white">
              Waterproof
            </Badge>
          ) : null}
          <CompareToggleButton product={product} variant="card" />
        </div>
        <div className="p-5 pb-3.5">
          <p className="mb-1 text-[11px] font-medium tracking-widest text-gold uppercase">
            {product.series}
          </p>
          <h3 className="mb-1 font-serif text-[21px] font-normal text-espresso">
            {product.name}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {product.thickness} | {product.wearLayer} | {product.width}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-cream px-5 pt-3.5 pb-5">
        <p className="font-serif text-[23px] text-espresso">
          ${product.pricePerSqFt.toFixed(2)}
          <small className="ml-1 font-sans text-xs font-light text-muted-foreground">
            /sq ft
          </small>
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
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-none border-espresso text-espresso no-underline hover:bg-espresso hover:text-bone",
            )}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
