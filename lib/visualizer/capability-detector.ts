import type { AiBackend, CapabilityResult } from "@/lib/visualizer/types";
import { WASM_WARMUP_THRESHOLD_MS } from "@/lib/visualizer/constants";

let cachedResult: CapabilityResult | null = null;

async function detectWebGpu(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return false;
  }

  try {
    const gpu = (navigator as Navigator & NavigatorGpu).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

function detectWebGl2(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2"));
}

function detectWorkers(): boolean {
  return typeof Worker !== "undefined";
}

async function measureWasmWarmupMs(): Promise<number> {
  const start = performance.now();
  const size = 256;
  const data = new Float32Array(size * size);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.sin(i * 0.01);
  }
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) {
    sum += data[i] * data[i];
  }
  void sum;
  return performance.now() - start;
}

export async function detectCapability(): Promise<CapabilityResult> {
  if (cachedResult) return cachedResult;

  const start = performance.now();
  const hasWebGl2 = detectWebGl2();
  const hasWorkers = detectWorkers();

  if (!hasWebGl2 || !hasWorkers) {
    cachedResult = {
      aiBackend: "server-required",
      renderBackend: "webgl2",
      warmupMs: performance.now() - start,
    };
    return cachedResult;
  }

  const hasWebGpu = await detectWebGpu();
  let aiBackend: AiBackend = hasWebGpu ? "webgpu" : "wasm";

  const wasmWarmupMs = await measureWasmWarmupMs();
  if (!hasWebGpu && wasmWarmupMs > WASM_WARMUP_THRESHOLD_MS) {
    aiBackend = "server-required";
  }

  cachedResult = {
    aiBackend,
    renderBackend: "webgl2",
    warmupMs: performance.now() - start,
  };

  return cachedResult;
}

export function resetCapabilityCache() {
  cachedResult = null;
}
