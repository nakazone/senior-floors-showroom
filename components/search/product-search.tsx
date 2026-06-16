"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { formatCartCurrency } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface SearchHit {
  objectID: string;
  slug: string;
  name: string;
  series: string;
  pricePerSqFt: number;
  imageUrl: string | null;
}

interface ProductSearchProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function ProductSearch({
  className,
  inputClassName,
  placeholder = "Search floors...",
  autoFocus = false,
  onNavigate,
}: ProductSearchProps) {
  const listboxId = useId();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query.trim())}`,
            { signal: controller.signal },
          );

          if (!response.ok) return;

          const data = (await response.json()) as { hits: SearchHit[] };
          setHits(data.hits);
          setOpen(true);
        } catch {
          // Ignore aborted or failed lookups.
        }
      });
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateToShop(searchQuery?: string) {
    const nextQuery = (searchQuery ?? query).trim();
    setOpen(false);
    onNavigate?.();

    if (nextQuery) {
      router.push(`/shop?q=${encodeURIComponent(nextQuery)}`);
      return;
    }

    router.push("/shop");
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-walnut" />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search products"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(Boolean(event.target.value.trim()));
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              navigateToShop();
            }
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "w-full border border-sand bg-white py-2.5 pr-10 pl-10 text-sm text-espresso outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-espresso",
            inputClassName,
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setHits([]);
              setOpen(false);
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-walnut"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open && query.trim() ? (
        <div
          id={listboxId}
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 border border-sand bg-white shadow-lg"
        >
          {isPending && hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-walnut">Searching...</p>
          ) : null}

          {!isPending && hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-walnut">
              No floors found. Try another search.
            </p>
          ) : null}

          {hits.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {hits.map((hit) => (
                <li key={hit.objectID}>
                  <Link
                    href={`/product/${hit.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors hover:bg-cream"
                  >
                    <div
                      className="h-12 w-12 shrink-0 bg-cream bg-cover bg-center"
                      style={
                        hit.imageUrl
                          ? { backgroundImage: `url(${hit.imageUrl})` }
                          : undefined
                      }
                    />
                    <div className="min-w-0">
                      <p className="truncate font-serif text-espresso">
                        {hit.name}
                      </p>
                      <p className="truncate text-xs text-walnut">
                        {hit.series} | {formatCartCurrency(hit.pricePerSqFt)}
                        /sq ft
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => navigateToShop()}
            className="w-full cursor-pointer border-t border-cream px-4 py-3 text-left text-sm text-walnut underline"
          >
            View all results for &quot;{query.trim()}&quot;
          </button>
        </div>
      ) : null}
    </div>
  );
}
