import Link from "next/link";
import Image from "next/image";
import {
  formatGalleryLabel,
  type InspirationGalleryItem,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

interface GalleryMasonryProps {
  items: InspirationGalleryItem[];
}

export function GalleryMasonry({ items }: GalleryMasonryProps) {
  if (items.length === 0) {
    return (
      <div className="border border-sand bg-bone p-10 text-center">
        <p className="font-serif text-xl text-walnut">No rooms match this filter</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try another room type or style.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 xl:auto-rows-[240px]">
      {items.map((item, index) => {
        const href = item.productSlug
          ? `/product/${item.productSlug}`
          : "/shop";
        const tall = index % 3 === 0;

        return (
          <article
            key={item.id}
            className={cn(
              "group relative overflow-hidden bg-espresso",
              tall ? "row-span-2 min-h-[320px] md:min-h-0" : "min-h-[220px] xl:min-h-0",
            )}
          >
            <Link href={href} className="block h-full w-full no-underline">
              <div className="relative h-full min-h-[inherit] w-full">
                <Image
                  src={item.imageUrl}
                  alt={`${formatGalleryLabel(item.roomType)} - ${formatGalleryLabel(item.style)}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-0 bottom-0 left-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] tracking-[0.14em] text-gold uppercase">
                    {formatGalleryLabel(item.roomType)} | {formatGalleryLabel(item.style)}
                  </p>
                  {item.productName ? (
                    <p className="mt-1 font-serif text-lg text-bone">{item.productName}</p>
                  ) : null}
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
