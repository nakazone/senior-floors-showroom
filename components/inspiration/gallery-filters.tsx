"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  galleryRoomFilters,
  galleryStyleFilters,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

export function GalleryFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRoom = searchParams.get("room") ?? "all";
  const activeStyle = searchParams.get("style");

  function updateFilter(key: "room" | "style", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/inspiration?${query}` : "/inspiration", {
      scroll: false,
    });
  }

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-wrap gap-2">
        {galleryRoomFilters.map((filter) => {
          const isActive =
            filter.value === "all"
              ? !searchParams.get("room")
              : activeRoom === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                updateFilter("room", filter.value === "all" ? null : filter.value)
              }
              className={cn(
                "cursor-pointer border px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors",
                isActive
                  ? "border-espresso bg-espresso text-bone"
                  : "border-sand bg-white text-walnut hover:border-espresso hover:text-espresso",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {galleryStyleFilters.map((filter) => {
          const isActive = activeStyle === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                updateFilter("style", isActive ? null : filter.value)
              }
              className={cn(
                "cursor-pointer border px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors",
                isActive
                  ? "border-gold bg-gold text-espresso"
                  : "border-sand bg-bone text-walnut hover:border-gold hover:text-espresso",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
