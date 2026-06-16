#!/usr/bin/env node
/**
 * Copy ONNX Runtime WASM artifacts to public/onnx for same-origin loading.
 * Run via postinstall so Vercel serves WASM from the app domain (no CDN fetch failures).
 */
const fs = require("node:fs");
const path = require("node:path");

const sourceDir = path.join(
  process.cwd(),
  "node_modules/onnxruntime-web/dist",
);
const targetDir = path.join(process.cwd(), "public/onnx");

const files = [
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd-threaded.asyncify.mjs",
  "ort-wasm-simd-threaded.asyncify.wasm",
];

if (!fs.existsSync(sourceDir)) {
  console.warn("[copy-onnx-wasm] onnxruntime-web not installed, skipping.");
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  const from = path.join(sourceDir, file);
  const to = path.join(targetDir, file);
  if (!fs.existsSync(from)) {
    console.warn(`[copy-onnx-wasm] Missing ${file}, skipping.`);
    continue;
  }
  fs.copyFileSync(from, to);
}

console.log(`[copy-onnx-wasm] Copied ${files.length} files to public/onnx/`);
