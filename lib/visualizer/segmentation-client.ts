import type { AiBackend, FloorMaskResult } from "@/lib/visualizer/types";

export async function segmentFloorOnDevice(
  imageBitmap: ImageBitmap,
  backend: AiBackend,
): Promise<FloorMaskResult> {
  const { segmentFloorOnDevice: runSegmentation } = await import(
    "@/lib/visualizer/segmentation-engine"
  );
  return runSegmentation(imageBitmap, backend);
}

export async function segmentFloorOnServer(file: File): Promise<FloorMaskResult> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch("/api/visualizer/process", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Server-side segmentation failed");
  }

  const payload = (await response.json()) as {
    mask: number[];
    width: number;
    height: number;
  };

  return {
    maskData: new Uint8ClampedArray(payload.mask),
    width: payload.width,
    height: payload.height,
  };
}

export function terminateSegmentationWorker() {
  // No-op: segmentation runs on the main thread.
}
