"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/types";
import { productToVisualizerOption } from "@/lib/visualizer/utils";

const RoomVisualizer = dynamic(
  () =>
    import("@/components/visualizer/room-visualizer").then((mod) => mod.RoomVisualizer),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-border bg-white p-10 text-center text-sm text-text-muted">
        Loading room visualizer...
      </div>
    ),
  },
);

interface RoomVisualizerEmbedProps {
  product?: Product;
  className?: string;
}

export function RoomVisualizerEmbed({ product, className }: RoomVisualizerEmbedProps) {
  const option = product ? productToVisualizerOption(product) : null;
  const products = option ? [option] : [];

  return (
    <div className={className}>
      <RoomVisualizer products={products} initialProductSlug={product?.slug} />
    </div>
  );
}
