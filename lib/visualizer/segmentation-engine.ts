import {
  pipeline,
  RawImage,
  type ImageSegmentationPipeline,
} from "@huggingface/transformers";
import { configureTransformersEnv } from "@/lib/visualizer/configure-transformers-env";
import {
  ADE20K_FLOOR_LABELS,
  SEGMENTATION_MODEL_ID,
} from "@/lib/visualizer/constants";
import type { AiBackend, FloorMaskResult } from "@/lib/visualizer/types";

let segmenter: ImageSegmentationPipeline | null = null;
let activeBackend: AiBackend | null = null;
let loadPromise: Promise<ImageSegmentationPipeline> | null = null;

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

async function getSegmenter(backend: AiBackend): Promise<ImageSegmentationPipeline> {
  configureTransformersEnv();

  if (segmenter && activeBackend === backend) {
    return segmenter;
  }

  if (loadPromise && activeBackend === backend) {
    return loadPromise;
  }

  activeBackend = backend;
  loadPromise = pipeline("image-segmentation", SEGMENTATION_MODEL_ID, {
    device: backend === "webgpu" ? "webgpu" : "wasm",
    dtype: backend === "webgpu" ? "fp16" : "q8",
  }).then((model) => {
    if (typeof model !== "function") {
      throw new Error("Segmentation model failed to initialize");
    }
    segmenter = model as ImageSegmentationPipeline;
    return segmenter;
  });

  return loadPromise;
}

async function imageBitmapToRawImage(imageBitmap: ImageBitmap): Promise<RawImage> {
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to read uploaded photo");

  ctx.drawImage(imageBitmap, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) reject(new Error("Unable to encode photo for segmentation"));
      else resolve(value);
    }, "image/jpeg", 0.92);
  });

  return RawImage.read(blob);
}

export async function segmentFloorOnDevice(
  imageBitmap: ImageBitmap,
  backend: AiBackend,
): Promise<FloorMaskResult> {
  const model = await getSegmenter(backend);
  const rawImage = await imageBitmapToRawImage(imageBitmap);
  const results = await model(rawImage);

  if (!Array.isArray(results)) {
    throw new Error("Unexpected segmentation output from model");
  }

  const floorMask = results.find((entry) => isFloorLabel(entry.label));

  if (!floorMask?.mask) {
    throw new Error(
      "Floor region not detected. Try a photo with more visible floor area and better lighting.",
    );
  }

  return maskFromRawImage(floorMask.mask);
}

export async function preloadSegmentationModel(backend: AiBackend = "wasm") {
  await getSegmenter(backend);
}
