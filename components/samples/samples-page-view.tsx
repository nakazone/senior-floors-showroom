"use client";

import { useEffect } from "react";
import type { Product } from "@/types";
import { useSampleStore } from "@/lib/stores/sample-store";
import { SamplePicker } from "@/components/samples/sample-picker";
import { SampleOrderForm } from "@/components/samples/sample-order-form";

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
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div>
        <p className="mb-6 max-w-xl text-walnut">
          Order up to 3 physical samples and receive them at your door. Feel the
          texture, see the color in your light, and compare against your
          furniture before you buy.
        </p>
        <SampleOrderForm />
      </div>
      <div>
        <p className="mb-4 text-sm font-medium tracking-widest text-espresso uppercase">
          Choose samples
        </p>
        <SamplePicker products={products} />
      </div>
    </div>
  );
}
