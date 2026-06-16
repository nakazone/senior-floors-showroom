"use client";

import dynamic from "next/dynamic";
import type { VisualizerProductOption } from "@/lib/visualizer/types";

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

interface RoomVisualizerLoaderProps {
  products: VisualizerProductOption[];
  initialProductSlug?: string;
}

export function RoomVisualizerLoader({
  products,
  initialProductSlug,
}: RoomVisualizerLoaderProps) {
  return (
    <RoomVisualizer products={products} initialProductSlug={initialProductSlug} />
  );
}
