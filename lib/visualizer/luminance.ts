import { MASK_THRESHOLD } from "@/lib/visualizer/constants";

export function computeMeanFloorLuminance(
  imageData: ImageData,
  mask: Uint8ClampedArray,
): number {
  const { data, width, height } = imageData;
  let sum = 0;
  let count = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const maskIndex = y * width + x;
      if (mask[maskIndex] < MASK_THRESHOLD) continue;

      const pixelIndex = maskIndex * 4;
      const r = data[pixelIndex] / 255;
      const g = data[pixelIndex + 1] / 255;
      const b = data[pixelIndex + 2] / 255;
      sum += 0.299 * r + 0.587 * g + 0.114 * b;
      count += 1;
    }
  }

  return count > 0 ? sum / count : 0.5;
}
