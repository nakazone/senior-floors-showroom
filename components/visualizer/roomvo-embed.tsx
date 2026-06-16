"use client";

interface RoomvoEmbedProps {
  productSku?: string;
  className?: string;
}

export function RoomvoEmbed({ productSku, className }: RoomvoEmbedProps) {
  return (
    <div className={className}>
      <div className="flex min-h-[400px] items-center justify-center border border-sand bg-cream p-8 text-center">
        <div>
          <p className="mb-2 font-serif text-2xl text-espresso">Room Visualizer</p>
          <p className="text-sm text-walnut">
            Roomvo SDK embed will be configured here
            {productSku ? ` for SKU: ${productSku}` : ""}.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            See project docs for Roomvo catalog onboarding steps.
          </p>
        </div>
      </div>
    </div>
  );
}
