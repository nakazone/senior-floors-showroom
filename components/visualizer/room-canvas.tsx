"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FloorCompositor } from "@/lib/visualizer/floor-compositor";
import { detectCapability } from "@/lib/visualizer/capability-detector";
import { computeMeanFloorLuminance } from "@/lib/visualizer/luminance";
import { computeFloorPerspective } from "@/lib/visualizer/perspective-mapper";
import {
  segmentFloorOnDevice,
  segmentFloorOnServer,
} from "@/lib/visualizer/segmentation-client";
import type {
  AiBackend,
  InstallDirection,
  ProcessingStage,
  VisualizerProductOption,
} from "@/lib/visualizer/types";
import {
  computeDefaultTileScale,
  fileToImageBitmap,
  imageBitmapToImageData,
  loadImage,
} from "@/lib/visualizer/utils";

export interface RoomCanvasHandle {
  loadPhoto: (file: File, options?: { useServer?: boolean }) => Promise<void>;
  setProduct: (product: VisualizerProductOption) => Promise<number>;
  setDirection: (direction: InstallDirection) => void;
  setScale: (scale: number) => void;
  setShowOriginal: (show: boolean) => void;
  getComposedImage: () => Promise<Blob>;
}

interface RoomCanvasProps {
  onStageChange?: (stage: ProcessingStage, message?: string) => void;
  onReadyChange?: (ready: boolean) => void;
  className?: string;
}

export const RoomCanvas = forwardRef<RoomCanvasHandle, RoomCanvasProps>(
  function RoomCanvas({ onStageChange, onReadyChange, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const compositorRef = useRef<FloorCompositor | null>(null);
    const photoBitmapRef = useRef<ImageBitmap | null>(null);
    const aiBackendRef = useRef<AiBackend>("wasm");
    const directionRef = useRef<InstallDirection>("horizontal");
    const scaleRef = useRef(4);
    const showOriginalRef = useRef(false);
    const selectedProductRef = useRef<VisualizerProductOption | null>(null);
    const [ready, setReady] = useState(false);

    const setStage = useCallback(
      (stage: ProcessingStage, message?: string) => {
        onStageChange?.(stage, message);
      },
      [onStageChange],
    );

    const renderFrame = useCallback(() => {
      compositorRef.current?.render(false);
    }, []);

    useEffect(() => {
      if (!canvasRef.current) return;
      compositorRef.current = new FloorCompositor(canvasRef.current);
      return () => {
        compositorRef.current?.destroy();
        compositorRef.current = null;
        photoBitmapRef.current?.close();
      };
    }, []);

    useEffect(() => {
      onReadyChange?.(ready);
    }, [onReadyChange, ready]);

    const applyProductTexture = useCallback(
      async (product: VisualizerProductOption) => {
        const compositor = compositorRef.current;
        if (!compositor) return;

        const texture = await loadImage(product.textureUrl);
        compositor.setFloorTexture(texture);
        compositor.setTileScale(scaleRef.current);
        compositor.setDirection(directionRef.current);
        renderFrame();
      },
      [renderFrame],
    );

    useImperativeHandle(ref, () => ({
      async loadPhoto(file, options) {
        setReady(false);
        setStage("capability");

        try {
          const capability = await detectCapability();
          aiBackendRef.current = options?.useServer
            ? "server-required"
            : capability.aiBackend === "webgpu"
              ? "wasm"
              : capability.aiBackend;

          if (aiBackendRef.current === "server-required" && !options?.useServer) {
            throw new Error("SERVER_CONSENT_REQUIRED");
          }

          const bitmap = await fileToImageBitmap(file);
          photoBitmapRef.current?.close();
          photoBitmapRef.current = bitmap;

          setStage("segmentation");
          const mask =
            aiBackendRef.current === "server-required"
              ? await segmentFloorOnServer(file)
              : await segmentFloorOnDevice(bitmap, aiBackendRef.current);

          if (mask.width !== bitmap.width || mask.height !== bitmap.height) {
            const resized = await resizeMask(mask, bitmap.width, bitmap.height);
            mask.maskData = resized.maskData;
            mask.width = resized.width;
            mask.height = resized.height;
          }

          setStage("perspective");
          const perspective = computeFloorPerspective(
            mask.maskData,
            mask.width,
            mask.height,
          );

          const imageData = await imageBitmapToImageData(bitmap);
          const meanLuminance = computeMeanFloorLuminance(imageData, mask.maskData);

          setStage("rendering");
          const compositor = compositorRef.current;
          if (!compositor) throw new Error("Canvas not initialized");

          compositor.resize(bitmap.width, bitmap.height);
          compositor.setPhoto(bitmap, bitmap.width, bitmap.height);
          compositor.setMask(mask.maskData, mask.width, mask.height);
          compositor.setInverseHomography(perspective.inverseHomography);
          compositor.setMeanLuminance(meanLuminance);
          compositor.setDirection(directionRef.current);
          compositor.setShowOriginal(showOriginalRef.current);

          if (selectedProductRef.current) {
            await applyProductTexture(selectedProductRef.current);
          } else {
            compositor.render(true);
          }

          setReady(true);
          setStage("ready");
        } catch (error) {
          if (error instanceof Error && error.message === "SERVER_CONSENT_REQUIRED") {
            throw error;
          }
          setStage(
            "error",
            error instanceof Error ? error.message : "Unable to process photo",
          );
          throw error;
        }
      },

      async setProduct(product) {
        selectedProductRef.current = product;
        scaleRef.current = computeDefaultTileScale(
          photoBitmapRef.current?.width ?? 1600,
          product.plankWidthMeters,
        );
        compositorRef.current?.setTileScale(scaleRef.current);
        await applyProductTexture(product);
        return scaleRef.current;
      },

      setDirection(direction) {
        directionRef.current = direction;
        compositorRef.current?.setDirection(direction);
        renderFrame();
      },

      setScale(scale) {
        scaleRef.current = scale;
        compositorRef.current?.setTileScale(scale);
        renderFrame();
      },

      setShowOriginal(show) {
        showOriginalRef.current = show;
        compositorRef.current?.setShowOriginal(show);
        renderFrame();
      },

      async getComposedImage() {
        const compositor = compositorRef.current;
        if (!compositor) throw new Error("Nothing to export yet");
        compositor.setShowOriginal(false);
        compositor.render(false);
        const blob = await compositor.toBlob();
        compositor.setShowOriginal(showOriginalRef.current);
        renderFrame();
        return blob;
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={className}
        aria-label="Room visualizer preview"
      />
    );
  },
);

async function resizeMask(
  mask: { maskData: Uint8ClampedArray; width: number; height: number },
  targetWidth: number,
  targetHeight: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = mask.width;
  canvas.height = mask.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to resize mask");

  const imageData = new ImageData(mask.width, mask.height);
  for (let i = 0; i < mask.maskData.length; i += 1) {
    const value = mask.maskData[i];
    imageData.data[i * 4] = value;
    imageData.data[i * 4 + 1] = value;
    imageData.data[i * 4 + 2] = value;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;
  const resizedCtx = resizedCanvas.getContext("2d");
  if (!resizedCtx) throw new Error("Unable to resize mask");

  resizedCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  const resized = resizedCtx.getImageData(0, 0, targetWidth, targetHeight);
  const binary = new Uint8ClampedArray(targetWidth * targetHeight);
  for (let i = 0; i < binary.length; i += 1) {
    binary[i] = resized.data[i * 4] > 127 ? 255 : 0;
  }

  return { maskData: binary, width: targetWidth, height: targetHeight };
}
