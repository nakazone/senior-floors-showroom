import Link from "next/link";
import type { Product } from "@/types";

interface AiResultCardProps {
  product: Product;
}

export function AiResultCard({ product }: AiResultCardProps) {
  const primaryImage = product.images?.[0];
  const variant = product.variants?.[0];
  const backgroundStyle =
    variant?.hexPrimary && variant?.hexSecondary
      ? {
          background: `linear-gradient(135deg, ${variant.hexPrimary}, ${variant.hexSecondary})`,
        }
      : primaryImage
        ? { backgroundImage: `url(${primaryImage.url})` }
        : undefined;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block border border-bone/10 bg-bone/7 p-4 no-underline transition-colors hover:bg-bone/12"
    >
      <div
        className="mb-3 h-16 bg-cream bg-cover bg-center"
        style={backgroundStyle}
      />
      <p className="mb-1 text-sm font-medium text-bone">{product.name}</p>
      <p className="text-xs text-gold">${product.pricePerSqFt.toFixed(2)}/sq ft</p>
      <p className="mt-1 text-[11px] tracking-wider text-sage uppercase">
        Perfect match
      </p>
    </Link>
  );
}
