import type { Product } from "@/types";
import type { VisualizerProductOption } from "@/lib/visualizer/types";

const INCHES_TO_METERS = 0.0254;

export function parsePlankWidthMeters(widthLabel: string): number {
  const inchesMatch = widthLabel.match(/([\d.]+)\s*(?:in|inch|inches|"|'')/i);
  if (inchesMatch) {
    return Number.parseFloat(inchesMatch[1]) * INCHES_TO_METERS;
  }

  const mmMatch = widthLabel.match(/([\d.]+)\s*mm/i);
  if (mmMatch) {
    return Number.parseFloat(mmMatch[1]) / 1000;
  }

  return 0.19;
}

export function productToVisualizerOption(product: Product): VisualizerProductOption | null {
  const textureUrl =
    product.images?.find((image) => image.type === "macro-texture")?.url ??
    product.images?.[0]?.url;

  if (!textureUrl) return null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    series: product.series,
    textureUrl,
    plankWidthMeters: parsePlankWidthMeters(product.width),
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load texture: ${src}`));
    image.src = src;
  });
}

export async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
  const bitmap = await createImageBitmap(file);
  return bitmap;
}

export async function imageBitmapToImageData(bitmap: ImageBitmap): Promise<ImageData> {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to read uploaded photo");
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

export function computeDefaultTileScale(
  photoWidth: number,
  plankWidthMeters: number,
): number {
  const assumedRoomWidthMeters = 4.5;
  const pixelsPerMeter = photoWidth / assumedRoomWidthMeters;
  const plankPixels = plankWidthMeters * pixelsPerMeter;
  return Math.max(2, Math.min(12, photoWidth / Math.max(plankPixels, 1)));
}
