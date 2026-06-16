"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const tabs = [
  { id: "gallery", label: "Gallery", types: ["gallery"] },
  { id: "room", label: "Real Room", types: ["room-scene"] },
  { id: "macro", label: "Macro Texture", types: ["macro-texture"] },
] as const;

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("gallery");

  const video = images.find((image) => image.type === "video");

  const filteredImages = useMemo(() => {
    const tab = tabs.find((entry) => entry.id === activeTab);
    const typed = images.filter((image) =>
      (tab?.types as readonly string[]).includes(image.type),
    );

    if (typed.length > 0) return typed;

    return images.filter((image) => image.type !== "video");
  }, [activeTab, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = filteredImages[activeIndex] ?? filteredImages[0];

  if (!activeImage) {
    return (
      <div className="flex h-[420px] items-center justify-center bg-cream text-walnut">
        No images available
      </div>
    );
  }

  return (
    <div className="bg-cream">
      <div
        className="flex gap-0 overflow-x-auto border-b border-sand bg-white"
        role="tablist"
        aria-label="Product gallery views"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`gallery-panel-${tab.id}`}
            id={`gallery-tab-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              setActiveIndex(0);
            }}
            className={cn(
              "min-h-11 shrink-0 cursor-pointer px-4 py-3 text-xs tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset sm:px-5",
              activeTab === tab.id
                ? "border-b-2 border-espresso text-espresso"
                : "text-walnut hover:text-espresso",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`gallery-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`gallery-tab-${activeTab}`}
        className="relative h-[clamp(280px,58vw,420px)] overflow-hidden"
      >
        <Zoom>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.url}
            alt={`${productName} - ${activeTab}`}
            className="h-[clamp(280px,58vw,420px)] w-full object-cover"
          />
        </Zoom>
      </div>

      {filteredImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto bg-cream p-4">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Show image ${index + 1} of ${filteredImages.length}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-14 w-[72px] shrink-0 overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                index === activeIndex ? "border-espresso" : "border-transparent",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      ) : null}

      {video ? (
        <div className="border-t border-sand bg-white p-4">
          <p className="mb-2 text-[11px] tracking-widest text-walnut uppercase">
            Installation Video
          </p>
          <video
            controls
            playsInline
            poster={images[0]?.url}
            className="w-full bg-espresso"
          >
            <source src={video.url} type="video/mp4" />
          </video>
        </div>
      ) : null}
    </div>
  );
}
