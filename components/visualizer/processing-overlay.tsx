"use client";

import type { ProcessingStage } from "@/lib/visualizer/types";
import { cn } from "@/lib/utils";

const STAGE_MESSAGES: Record<Exclude<ProcessingStage, "idle" | "ready" | "error">, string> = {
  capability: "Analyzing room geometry...",
  segmentation: "Segmenting floor (on-device)...",
  perspective: "Mapping perspective...",
  rendering: "Rendering...",
};

interface ProcessingOverlayProps {
  stage: ProcessingStage;
  message?: string;
  className?: string;
}

export function ProcessingOverlay({ stage, message, className }: ProcessingOverlayProps) {
  if (stage === "idle" || stage === "ready") return null;

  const label =
    stage === "error"
      ? message ?? "Something went wrong"
      : message ?? STAGE_MESSAGES[stage];

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-primary/80 px-6 text-center backdrop-blur-sm",
        className,
      )}
    >
      {stage !== "error" ? (
        <div
          className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-secondary"
          aria-hidden
        />
      ) : null}
      <p className="max-w-sm text-sm font-medium text-white">{label}</p>
    </div>
  );
}
