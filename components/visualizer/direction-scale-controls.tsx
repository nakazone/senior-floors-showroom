"use client";

import type { InstallDirection } from "@/lib/visualizer/types";
import { cn } from "@/lib/utils";

interface DirectionScaleControlsProps {
  direction: InstallDirection;
  scale: number;
  onDirectionChange: (direction: InstallDirection) => void;
  onScaleChange: (scale: number) => void;
  disabled?: boolean;
}

const directions: { id: InstallDirection; label: string }[] = [
  { id: "horizontal", label: "Horizontal" },
  { id: "vertical", label: "Vertical" },
  { id: "diagonal", label: "Diagonal" },
];

export function DirectionScaleControls({
  direction,
  scale,
  onDirectionChange,
  onScaleChange,
  disabled = false,
}: DirectionScaleControlsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
          Install Direction
        </p>
        <div className="flex flex-wrap gap-2">
          {directions.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onDirectionChange(item.id)}
              className={cn(
                "sf-chip",
                direction === item.id && "sf-chip-active",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
            Plank Scale
          </p>
          <span className="text-sm font-medium text-text-dark">{scale.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min={1}
          max={16}
          step={0.1}
          value={scale}
          disabled={disabled}
          onChange={(event) => onScaleChange(Number.parseFloat(event.target.value))}
          className="h-2 w-full cursor-pointer accent-primary"
          aria-label="Plank scale"
        />
      </div>
    </div>
  );
}
