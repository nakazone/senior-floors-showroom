import * as Comlink from "comlink";
import type { AiBackend, FloorMaskResult } from "@/lib/visualizer/types";
import type { FloorSegmentationWorkerApi } from "@/lib/visualizer/workers/floor-segmentation.worker";

let worker: Worker | null = null;
let api: Comlink.Remote<FloorSegmentationWorkerApi> | null = null;

function getWorkerApi() {
  if (!worker || !api) {
    worker = new Worker(
      new URL("./workers/floor-segmentation.worker.ts", import.meta.url),
      { type: "module" },
    );
    api = Comlink.wrap<FloorSegmentationWorkerApi>(worker);
  }
  return api;
}

export async function segmentFloorOnDevice(
  imageBitmap: ImageBitmap,
  backend: AiBackend,
): Promise<FloorMaskResult> {
  const remote = getWorkerApi();
  return remote.segmentFloor(imageBitmap, backend);
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
  worker?.terminate();
  worker = null;
  api = null;
}
