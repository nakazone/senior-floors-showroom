"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import {
  MAX_UPLOAD_BYTES,
  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,
} from "@/lib/visualizer/constants";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function UploadDropzone({
  onFileSelected,
  disabled = false,
  className,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload a JPG or PNG photo.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("Photo must be 10MB or smaller.");
    }

    const bitmap = await createImageBitmap(file);
    if (bitmap.width < MIN_IMAGE_WIDTH || bitmap.height < MIN_IMAGE_HEIGHT) {
      bitmap.close();
      throw new Error(
        `Photo must be at least ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px.`,
      );
    }
    bitmap.close();
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      try {
        await validateFile(file);
        onFileSelected(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid photo");
      }
    },
    [onFileSelected, validateFile],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (disabled) return;
          const file = event.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        className={cn(
          "flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-all duration-300",
          dragActive
            ? "border-secondary bg-secondary/10"
            : "border-border bg-bg-light hover:border-primary hover:bg-white",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          {dragActive ? <Upload className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
        </div>
        <p className="text-base font-semibold text-text-dark">
          Drop your room photo here
        </p>
        <p className="mt-2 max-w-sm text-sm text-text-muted">
          JPG or PNG, at least {MIN_IMAGE_WIDTH}x{MIN_IMAGE_HEIGHT}px, up to 10MB
        </p>
        <span className="btn-outline mt-5 inline-flex pointer-events-none">
          Choose Photo
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
