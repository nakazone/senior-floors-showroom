import { RoomvoEmbed } from "@/components/visualizer/roomvo-embed";
import { createPlaceholderMetadata } from "@/components/shared/placeholder-page";

export const metadata = createPlaceholderMetadata(
  "Room Visualizer",
  "See how our floors look in your space with our interactive room visualizer.",
);

export default function VisualizerPage() {
  return (
    <main className="section-padding bg-espresso pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow text-gold">Visualizer</span>
        <h1 className="display-heading mb-4 text-bone">
          See it in <em>your room</em>
        </h1>
        <p className="mb-10 max-w-xl text-bone/65">
          Upload a photo of your space and preview any Senior Floors product in
          realistic 3D.
        </p>
        <RoomvoEmbed className="w-full" />
      </div>
    </main>
  );
}
