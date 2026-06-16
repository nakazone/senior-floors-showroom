"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { FloorCalculator } from "@/components/product/floor-calculator";
import { ProductSpecs } from "@/components/product/product-specs";
import { ProductDownloads } from "@/components/product/product-downloads";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { CompareToggleButton } from "@/components/product/compare-toggle-button";
import { RoomvoEmbed } from "@/components/visualizer/roomvo-embed";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductDetailPanelProps {
  product: Product;
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  const [lastSqFt, setLastSqFt] = useState<number | null>(null);

  return (
    <div className="px-0 py-6 lg:px-8 lg:py-10">
      <p className="mb-2 text-[11px] font-medium tracking-[0.14em] text-gold uppercase">
        {product.series}
      </p>
      <h1 className="mb-4 font-serif text-4xl font-light text-espresso md:text-5xl">
        {product.name}
      </h1>

      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <p className="font-serif text-4xl font-light text-espresso">
          ${product.pricePerSqFt.toFixed(2)}
        </p>
        <span className="text-sm text-muted-foreground">/ sq ft</span>
        {product.compareAtPrice ? (
          <span className="text-sm text-muted-foreground line-through">
            ${product.compareAtPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {product.waterproof ? (
          <Badge className="rounded-none border-none bg-[#E8F4F0] text-[#2A6B5A]">
            Waterproof
          </Badge>
        ) : null}
        {product.petFriendly ? (
          <Badge className="rounded-none border-none bg-[#FDF3E8] text-[#8B5A1A]">
            Pet Friendly
          </Badge>
        ) : null}
        {product.installType === "click-lock" ? (
          <Badge className="rounded-none border-none bg-[#F0EBF8] text-[#5A3A8B]">
            Click Lock
          </Badge>
        ) : null}
      </div>

      <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-walnut">
        {product.description}
      </p>

      <ProductSpecs product={product} />
      <FloorCalculator
        product={product}
        onResultChange={(result) => setLastSqFt(result?.sqFt ?? null)}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <AddToCartButton
          product={product}
          sqFt={lastSqFt ?? product.boxCoverageSqFt}
          className="min-w-[180px] flex-1 py-6 text-[13px] tracking-wider uppercase"
        />
        <CompareToggleButton product={product} className="min-w-[160px]" />
        <Link
          href={`/samples?product=${product.slug}`}
          className="inline-flex min-w-[160px] items-center justify-center border border-espresso px-6 py-3 text-[13px] tracking-wider text-espresso uppercase no-underline transition-colors hover:bg-espresso hover:text-bone"
        >
          Order Sample
        </Link>
      </div>

      <Dialog>
        <DialogTrigger className="mb-6 w-full cursor-pointer border border-sand bg-transparent px-4 py-3 text-sm text-walnut transition-colors hover:border-espresso hover:text-espresso">
          Visualize This Floor
        </DialogTrigger>
        <DialogContent className="max-w-4xl rounded-none border-sand bg-bone p-0">
          <DialogHeader className="border-b border-sand px-6 py-4">
            <DialogTitle className="font-serif text-2xl font-light">
              Visualize {product.name}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <RoomvoEmbed productSku={product.slug} />
          </div>
        </DialogContent>
      </Dialog>

      <ProductDownloads slug={product.slug} />
    </div>
  );
}
