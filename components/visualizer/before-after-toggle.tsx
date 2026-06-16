"use client";

import { cn } from "@/lib/utils";

interface BeforeAfterToggleProps {
  showOriginal: boolean;
  onChange: (showOriginal: boolean) => void;
  disabled?: boolean;
}

export function BeforeAfterToggle({
  showOriginal,
  onChange,
  disabled = false,
}: BeforeAfterToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border bg-white p-1">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
          !showOriginal
            ? "bg-primary text-white shadow-sm"
            : "text-text-light hover:text-primary",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        With New Floor
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
          showOriginal
            ? "bg-primary text-white shadow-sm"
            : "text-text-light hover:text-primary",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        Original Photo
      </button>
    </div>
  );
}
