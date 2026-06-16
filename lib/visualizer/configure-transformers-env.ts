import { env } from "@huggingface/transformers";

let configured = false;

function isSafariBrowser() {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Configure Transformers.js ONNX runtime for browser + Next.js/Vercel.
 * WASM files are copied to public/onnx during postinstall (see scripts/copy-onnx-wasm.js).
 */
export function configureTransformersEnv() {
  if (configured || typeof window === "undefined") return;

  env.allowLocalModels = false;
  env.useBrowserCache = true;

  const wasmBackend = env.backends?.onnx?.wasm;
  if (wasmBackend) {
    // Single thread avoids SharedArrayBuffer / COOP requirements on Vercel.
    wasmBackend.numThreads = 1;

    const prefix = `${window.location.origin}/onnx/`;
    wasmBackend.wasmPaths = isSafariBrowser()
      ? {
          mjs: `${prefix}ort-wasm-simd-threaded.mjs`,
          wasm: `${prefix}ort-wasm-simd-threaded.wasm`,
        }
      : {
          mjs: `${prefix}ort-wasm-simd-threaded.asyncify.mjs`,
          wasm: `${prefix}ort-wasm-simd-threaded.asyncify.wasm`,
        };
  }

  configured = true;
}

export function resetTransformersEnvConfig() {
  configured = false;
}
