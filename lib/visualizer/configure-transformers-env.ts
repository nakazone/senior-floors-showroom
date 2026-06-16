import { env } from "@huggingface/transformers";

let configured = false;

/**
 * Configure Transformers.js ONNX runtime for browser + Next.js/Vercel.
 * Workers and some production bundles fail to resolve bundled WASM paths,
 * which surfaces as cryptic minified errors like "h is not a function".
 */
export function configureTransformersEnv() {
  if (configured || typeof window === "undefined") return;

  env.allowLocalModels = false;
  env.useBrowserCache = true;

  const wasmBackend = env.backends?.onnx?.wasm;
  if (wasmBackend) {
    wasmBackend.numThreads = Math.min(
      typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 1 : 1,
      4,
    );
    wasmBackend.wasmPaths =
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/";
  }

  configured = true;
}

export function resetTransformersEnvConfig() {
  configured = false;
}
