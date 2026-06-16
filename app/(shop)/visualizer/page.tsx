import { RoomVisualizerLoader } from "@/components/visualizer/room-visualizer-loader";
import { getFeaturedProducts } from "@/lib/products";
import { productToVisualizerOption } from "@/lib/visualizer/utils";
import { createPlaceholderMetadata } from "@/components/shared/placeholder-page";

export const metadata = createPlaceholderMetadata(
  "Room Visualizer",
  "Upload a photo of your room and preview Senior Floors products with on-device AI segmentation.",
);

interface VisualizerPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function VisualizerPage({ searchParams }: VisualizerPageProps) {
  const params = await searchParams;
  const products = await getFeaturedProducts(24);
  const visualizerProducts = products
    .map(productToVisualizerOption)
    .filter((product): product is NonNullable<typeof product> => product !== null);

  return (
    <main className="section-padding bg-bg-light pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow">Room Visualizer</span>
        <h1 className="display-heading mb-4">
          See it in <em>your room</em>
        </h1>
        <p className="mb-10 max-w-2xl text-text-light">
          Upload a photo of your space and preview how our LVP and engineered hardwood
          floors would look. Processing runs privately on your device with AI floor
          segmentation, perspective mapping, and real-time WebGL compositing.
        </p>
        <RoomVisualizerLoader
          products={visualizerProducts}
          initialProductSlug={params.product}
        />
      </div>
    </main>
  );
}
