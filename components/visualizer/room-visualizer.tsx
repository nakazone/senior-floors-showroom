"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { RoomCanvas, type RoomCanvasHandle } from "@/components/visualizer/room-canvas";
import { UploadDropzone } from "@/components/visualizer/upload-dropzone";
import { ProcessingOverlay } from "@/components/visualizer/processing-overlay";
import { DirectionScaleControls } from "@/components/visualizer/direction-scale-controls";
import { BeforeAfterToggle } from "@/components/visualizer/before-after-toggle";
import { ProductTexturePicker } from "@/components/visualizer/product-texture-picker";
import { ServerConsentModal } from "@/components/visualizer/server-consent-modal";
import { PrivacyNotice } from "@/components/visualizer/privacy-notice";
import type {
  InstallDirection,
  ProcessingStage,
  VisualizerProductOption,
} from "@/lib/visualizer/types";

interface RoomVisualizerProps {
  products: VisualizerProductOption[];
  initialProductSlug?: string;
}

export function RoomVisualizer({ products, initialProductSlug }: RoomVisualizerProps) {
  const canvasRef = useRef<RoomCanvasHandle>(null);
  const pendingFileRef = useRef<File | null>(null);

  const initialProduct = useMemo(() => {
    if (!initialProductSlug) return products[0] ?? null;
    return products.find((product) => product.slug === initialProductSlug) ?? products[0] ?? null;
  }, [initialProductSlug, products]);

  const [selectedProduct, setSelectedProduct] = useState<VisualizerProductOption | null>(
    initialProduct,
  );
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [stageMessage, setStageMessage] = useState<string>();
  const [ready, setReady] = useState(false);
  const [direction, setDirection] = useState<InstallDirection>("horizontal");
  const [scale, setScale] = useState(4);
  const [showOriginal, setShowOriginal] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState<"local" | "server">("local");

  const handleStageChange = useCallback((nextStage: ProcessingStage, message?: string) => {
    setStage(nextStage);
    setStageMessage(message);
  }, []);

  const processFile = useCallback(
    async (file: File, useServer = false) => {
      if (!canvasRef.current) return;

      try {
        setPrivacyMode(useServer ? "server" : "local");
        await canvasRef.current.loadPhoto(file, { useServer });

        if (selectedProduct) {
          const nextScale = await canvasRef.current.setProduct(selectedProduct);
          setScale(nextScale);
        }
      } catch (error) {
        if (error instanceof Error && error.message === "SERVER_CONSENT_REQUIRED") {
          pendingFileRef.current = file;
          setConsentOpen(true);
          setStage("idle");
          return;
        }

        handleStageChange(
          "error",
          error instanceof Error ? error.message : "Unable to process photo",
        );
      }
    },
    [selectedProduct, handleStageChange],
  );

  const handleProductSelect = useCallback(async (product: VisualizerProductOption) => {
    setSelectedProduct(product);
    if (ready && canvasRef.current) {
      const nextScale = await canvasRef.current.setProduct(product);
      setScale(nextScale);
    }
  }, [ready]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    const blob = await canvasRef.current.getComposedImage();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `senior-floors-visualization-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleReset = useCallback(() => {
    pendingFileRef.current = null;
    setReady(false);
    setStage("idle");
    setStageMessage(undefined);
    setShowOriginal(false);
    setPrivacyMode("local");
  }, []);

  return (
    <div className="space-y-8">
      <PrivacyNotice mode={privacyMode} />

      {!ready ? (
        <UploadDropzone
          onFileSelected={(file) => void processFile(file)}
          disabled={stage !== "idle" && stage !== "error"}
        />
      ) : null}

      <div className="relative overflow-hidden rounded-lg border border-border bg-bg-light">
        <RoomCanvas
          ref={canvasRef}
          onStageChange={handleStageChange}
          onReadyChange={setReady}
          className="block min-h-[320px] w-full bg-bg-light"
        />
        <ProcessingOverlay stage={stage} message={stageMessage} />
      </div>

      {ready ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BeforeAfterToggle
              showOriginal={showOriginal}
              disabled={!ready}
              onChange={(value) => {
                setShowOriginal(value);
                canvasRef.current?.setShowOriginal(value);
              }}
            />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleReset} className="btn-outline inline-flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                New Photo
              </button>
              <button type="button" onClick={() => void handleDownload()} className="btn-gold inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Save Preview
              </button>
            </div>
          </div>

          <DirectionScaleControls
            direction={direction}
            scale={scale}
            disabled={!ready}
            onDirectionChange={(value) => {
              setDirection(value);
              canvasRef.current?.setDirection(value);
            }}
            onScaleChange={(value) => {
              setScale(value);
              canvasRef.current?.setScale(value);
            }}
          />
        </>
      ) : null}

      <div>
        <div className="mb-4">
          <span className="eyebrow">Choose a Floor</span>
          <h2 className="text-2xl font-bold text-text-dark">Product textures</h2>
          <p className="mt-2 text-sm text-text-light">
            Swap products instantly after your photo is processed - no re-segmentation needed.
          </p>
        </div>
        <ProductTexturePicker
          products={products}
          selectedId={selectedProduct?.id ?? null}
          disabled={!ready}
          onSelect={(product) => void handleProductSelect(product)}
        />
      </div>

      <ServerConsentModal
        open={consentOpen}
        onCancel={() => {
          setConsentOpen(false);
          pendingFileRef.current = null;
        }}
        onConfirm={() => {
          const file = pendingFileRef.current;
          setConsentOpen(false);
          pendingFileRef.current = null;
          if (file) void processFile(file, true);
        }}
      />
    </div>
  );
}
