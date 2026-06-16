/// <reference lib="webworker" />

import * as Comlink from "comlink";
import { pipeline, env, RawImage, type ImageSegmentationPipeline } from "@huggingface/transformers";
import {
  ADE20K_FLOOR_LABELS,
  SEGMENTATION_MODEL_ID,
} from "@/lib/visualizer/constants";
import type { AiBackend, FloorMaskResult } from "@/lib/visualizer/types";

env.allowLocalModels = false;
env.useBrowserCache = true;

type Segmenter = ImageSegmentationPipeline;

let segmenter: Segmenter | null = null;
let activeBackend: AiBackend = "wasm";

async function getSegmenter(backend: AiBackend) {
  if (segmenter && activeBackend === backend) return segmenter;

  activeBackend = backend;
  segmenter = (await pipeline("image-segmentation", SEGMENTATION_MODEL_ID, {
    device: backend === "webgpu" ? "webgpu" : "wasm",
    dtype: backend === "webgpu" ? "fp16" : "q8",
  })) as ImageSegmentationPipeline;

  return segmenter;
}

function isFloorLabel(label: string | null) {
  if (!label) return false;
  const normalized = label.toLowerCase();
  return ADE20K_FLOOR_LABELS.some((candidate) => normalized.includes(candidate));
}

function maskFromRawImage(mask: RawImage): FloorMaskResult {
  const { width, height, data, channels } = mask;
  const binary = new Uint8ClampedArray(width * height);

  for (let i = 0; i < width * height; i += 1) {
    const value = channels === 1 ? data[i] : data[i * channels];
    binary[i] = value > 127 ? 255 : 0;
  }

  return { maskData: binary, width, height };
}

async function segmentFloor(
  imageBitmap: ImageBitmap,
  backend: AiBackend,
): Promise<FloorMaskResult> {
  const model = await getSegmenter(backend);
  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create OffscreenCanvas context");

  ctx.drawImage(imageBitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  const rawImage = new RawImage(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
    4,
  );

  const results = await model(rawImage, { subtask: "semantic" });
  const floorMask = results.find((entry) => isFloorLabel(entry.label));

  if (!floorMask?.mask) {
    throw new Error(
      "Floor region not detected. Try a photo with more visible floor area and better lighting.",
    );
  }

  return maskFromRawImage(floorMask.mask);
}

const api = {
  segmentFloor,
};

export type FloorSegmentationWorkerApi = typeof api;

Comlink.expose(api);
