/**
 * SegFormer fine-tuned on ADE20K via Xenova ONNX export for Transformers.js.
 * Original checkpoint: nvidia/segformer-b0-finetuned-ade-512-512
 * @see https://huggingface.co/Xenova/segformer-b0-finetuned-ade-512-512
 */
export const SEGMENTATION_MODEL_ID = "Xenova/segformer-b0-finetuned-ade-512-512";

/** ADE20K semantic label for floor (confirmed in objectInfo150.txt). */
export const ADE20K_FLOOR_LABELS = ["floor", "flooring", "ground"] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MIN_IMAGE_WIDTH = 800;
export const MIN_IMAGE_HEIGHT = 600;

export const WASM_WARMUP_THRESHOLD_MS = 10_000;
export const MASK_THRESHOLD = 128;

export const DIRECTION_ANGLES = {
  horizontal: 0,
  vertical: Math.PI / 2,
  diagonal: Math.PI / 4,
} as const;
