"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { useSampleStore } from "@/lib/stores/sample-store";
import { SampleBoxSelector } from "@/components/samples/sample-box-selector";
import { SamplePicker } from "@/components/samples/sample-picker";
import { SampleOrderForm } from "@/components/samples/sample-order-form";
import { sampleProgramPerks } from "@/lib/home-sections";

interface SamplesPageViewProps {
  products: Product[];
  initialSlug?: string;
}

export function SamplesPageView({
  products,
  initialSlug,
}: SamplesPageViewProps) {
  const toggleItem = useSampleStore((state) => state.toggleItem);

  useEffect(() => {
    if (!initialSlug) return;

    const product = products.find((entry) => entry.slug === initialSlug);
    if (!product) return;

    const alreadySelected = useSampleStore
      .getState()
      .items.some((item) => item.productId === product.id);

    if (alreadySelected) return;

    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images?.[0]?.url,
      hexPrimary: product.variants?.[0]?.hexPrimary,
      hexSecondary: product.variants?.[0]?.hexSecondary,
    });
  }, [initialSlug, products, toggleItem]);

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
      <div className="space-y-8">
        <div className="overflow-hidden rounded-lg border border-border bg-bg-light shadow-md">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/assets/samples.png"
              alt="Senior Floors sample box with flooring swatches"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
              <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
                Sample Program
              </p>
              <p className="mt-2 max-w-md text-lg font-bold leading-snug">
                Real swatches. Real texture. Delivered to your door.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <SampleBoxSelector />
          <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-text-light">
            {sampleProgramPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
            Choose your swatches
          </p>
          <SamplePicker products={products} />
        </div>

        <div className="rounded-lg border border-border bg-bg-light p-6">
          <p className="mb-5 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
            Shipping details
          </p>
          <SampleOrderForm />
        </div>
      </div>
    </div>
  );
}
