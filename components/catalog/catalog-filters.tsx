"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { countActiveFilters } from "@/lib/catalog-filters";
import {
  formatColorFamily,
  formatProductType,
  type CatalogFacets,
  type CatalogFilters,
} from "@/types/catalog";
import { cn } from "@/lib/utils";

interface CatalogFiltersProps {
  facets: CatalogFacets;
  lockedFilters?: Partial<CatalogFilters>;
}

interface QuickChip {
  label: string;
  params: Record<string, string | undefined>;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("sf-chip text-xs tracking-wide whitespace-nowrap", active && "sf-chip-active")}
    >
      {label}
    </button>
  );
}

export function CatalogFilters({ facets, lockedFilters = {} }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("q") ?? "",
  );

  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  const currentFilters = useMemo(() => {
    const tone = searchParams.get("tone");
    return {
      query: searchParams.get("q") || undefined,
      type:
        (searchParams.get("material")?.toUpperCase() as CatalogFilters["type"]) ||
        lockedFilters.type,
      colorTone:
        tone === "light" || tone === "medium" || tone === "dark"
          ? tone
          : lockedFilters.colorTone,
      waterproof:
        searchParams.get("waterproof") === "1" || lockedFilters.waterproof,
      petFriendly:
        searchParams.get("petFriendly") === "1" || lockedFilters.petFriendly,
      minPrice: Number(searchParams.get("minPrice") || facets.priceMin),
      maxPrice: Number(searchParams.get("maxPrice") || facets.priceMax),
      thickness: searchParams.get("thickness") || undefined,
      wearLayer: searchParams.get("wear") || undefined,
      series: searchParams.get("brand") || undefined,
      installType: searchParams.get("install") || undefined,
      width: searchParams.get("width") || undefined,
      length: searchParams.get("length") || undefined,
      finish: searchParams.get("finish") || undefined,
      colorFamily: searchParams.get("color") || undefined,
    } satisfies Partial<CatalogFilters>;
  }, [facets.priceMax, facets.priceMin, lockedFilters, searchParams]);

  const activeCount = countActiveFilters({
    ...currentFilters,
    query: currentFilters.query,
    type: currentFilters.type,
    waterproof: currentFilters.waterproof || undefined,
    petFriendly: currentFilters.petFriendly || undefined,
    minPrice:
      currentFilters.minPrice !== facets.priceMin
        ? currentFilters.minPrice
        : undefined,
    maxPrice:
      currentFilters.maxPrice !== facets.priceMax
        ? currentFilters.maxPrice
        : undefined,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });

      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const setSelectParam = (key: string, value: string | null) => {
    updateParams({ [key]: !value || value === "all" ? undefined : value });
  };

  const quickChips: QuickChip[] = [
    { label: "All", params: { material: undefined, tone: undefined, waterproof: undefined, petFriendly: undefined } },
    { label: "LVP", params: { material: "LVP", tone: undefined } },
    { label: "Engineered", params: { material: "ENGINEERED", tone: undefined } },
    { label: "Light Tones", params: { tone: "light", material: undefined } },
    { label: "Medium", params: { tone: "medium", material: undefined } },
    { label: "Dark Tones", params: { tone: "dark", material: undefined } },
    { label: "Waterproof", params: { waterproof: "1" } },
    { label: "Pet Friendly", params: { petFriendly: "1" } },
  ];

  const isChipActive = (chip: QuickChip) => {
    if (chip.label === "All") {
      return activeCount === 0 && !searchParams.get("q");
    }
    return Object.entries(chip.params).every(([key, value]) => {
      if (value === undefined) return !searchParams.get(key);
      return searchParams.get(key) === value;
    });
  };

  const priceValue = useMemo(
    () => [currentFilters.minPrice ?? facets.priceMin, currentFilters.maxPrice ?? facets.priceMax],
    [currentFilters.maxPrice, currentFilters.minPrice, facets.priceMax, facets.priceMin],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextQuery = searchValue.trim();
      const currentQuery = searchParams.get("q") ?? "";

      if (nextQuery === currentQuery) return;

      updateParams({ q: nextQuery || undefined });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchParams, searchValue, updateParams]);

  return (
    <div className={cn("mb-10 border-b border-cream pb-6", isPending && "opacity-70")}>
      <div className="relative mb-5 max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-walnut" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by name, series or style..."
          aria-label="Search catalog"
          className="w-full border border-sand bg-white py-3 pr-10 pl-10 text-sm text-espresso outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-espresso"
        />
        {searchValue ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchValue("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-walnut"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {quickChips.map((chip) => (
          <FilterChip
            key={chip.label}
            label={chip.label}
            active={isChipActive(chip)}
            onClick={() => {
              if (chip.label === "All") clearFilters();
              else updateParams(chip.params);
            }}
          />
        ))}
      </div>

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-walnut marker:content-none">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
          {activeCount > 0 ? (
            <span className="bg-gold px-2 py-0.5 text-[10px] font-semibold text-espresso">
              {activeCount}
            </span>
          ) : null}
        </summary>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Material
            </Label>
            <Select
              value={currentFilters.type || "all"}
              onValueChange={(value) => setSelectParam("material", value)}
              disabled={Boolean(lockedFilters.type)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="All materials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All materials</SelectItem>
                {facets.types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatProductType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Color
            </Label>
            <Select
              value={currentFilters.colorFamily || "all"}
              onValueChange={(value) => {
                if (!value || value === "all") {
                  updateParams({ color: undefined, tone: undefined });
                } else {
                  updateParams({ color: value, tone: undefined });
                }
              }}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="All colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All colors</SelectItem>
                {facets.colorFamilies.map((color) => (
                  <SelectItem key={color} value={color}>
                    {formatColorFamily(color)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Brand / Series
            </Label>
            <Select
              value={currentFilters.series || "all"}
              onValueChange={(value) => setSelectParam("brand", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {facets.series.map((series) => (
                  <SelectItem key={series} value={series}>
                    {series}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Thickness
            </Label>
            <Select
              value={currentFilters.thickness || "all"}
              onValueChange={(value) => setSelectParam("thickness", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="Any thickness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any thickness</SelectItem>
                {facets.thicknesses.map((thickness) => (
                  <SelectItem key={thickness} value={thickness}>
                    {thickness}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Wear Layer
            </Label>
            <Select
              value={currentFilters.wearLayer || "all"}
              onValueChange={(value) => setSelectParam("wear", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="Any wear layer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any wear layer</SelectItem>
                {facets.wearLayers.map((wear) => (
                  <SelectItem key={wear} value={wear}>
                    {wear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Installation
            </Label>
            <Select
              value={currentFilters.installType || "all"}
              onValueChange={(value) => setSelectParam("install", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="Any installation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any installation</SelectItem>
                {facets.installTypes.map((install) => (
                  <SelectItem key={install} value={install}>
                    {install}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Width
            </Label>
            <Select
              value={currentFilters.width || "all"}
              onValueChange={(value) => setSelectParam("width", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="Any width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any width</SelectItem>
                {facets.widths.map((width) => (
                  <SelectItem key={width} value={width}>
                    {width}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-[11px] tracking-widest text-walnut uppercase">
              Finish
            </Label>
            <Select
              value={currentFilters.finish || "all"}
              onValueChange={(value) => setSelectParam("finish", value)}
            >
              <SelectTrigger className="rounded-none border-sand bg-white">
                <SelectValue placeholder="Any finish" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any finish</SelectItem>
                {facets.finishes.map((finish) => (
                  <SelectItem key={finish} value={finish}>
                    {finish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 max-w-md">
          <Label className="mb-3 block text-[11px] tracking-widest text-walnut uppercase">
            Price per sq ft
          </Label>
          <Slider
            min={facets.priceMin}
            max={facets.priceMax}
            step={0.25}
            value={priceValue}
            onValueChange={(value) => {
              const [min, max] = value as number[];
              updateParams({
                minPrice: String(min),
                maxPrice: String(max),
              });
            }}
          />
          <div className="mt-2 flex justify-between text-xs text-walnut">
            <span>${priceValue[0].toFixed(2)}</span>
            <span>${priceValue[1].toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-walnut">
            <Checkbox
              checked={Boolean(currentFilters.waterproof)}
              disabled={lockedFilters.waterproof}
              onCheckedChange={(checked) =>
                updateParams({ waterproof: checked ? "1" : undefined })
              }
            />
            Waterproof
          </label>
          <label className="flex items-center gap-2 text-sm text-walnut">
            <Checkbox
              checked={Boolean(currentFilters.petFriendly)}
              onCheckedChange={(checked) =>
                updateParams({ petFriendly: checked ? "1" : undefined })
              }
            />
            Pet Friendly
          </label>
        </div>

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex items-center gap-2 text-xs tracking-wider text-walnut uppercase transition-colors hover:text-espresso"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        ) : null}
      </details>
    </div>
  );
}
