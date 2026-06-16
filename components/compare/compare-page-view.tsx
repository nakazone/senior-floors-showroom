"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_COMPARE_ITEMS } from "@/lib/compare";
import { useCompareStore } from "@/lib/stores/compare-store";
import { CompareTable } from "@/components/product/compare-table";
import { Button } from "@/components/ui/button";

export function ComparePageView() {
  const items = useCompareStore((state) => state.items);
  const clearAll = useCompareStore((state) => state.clearAll);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[320px] animate-pulse bg-cream/50" />;
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-walnut">
          Comparing{" "}
          <strong className="text-espresso">{items.length}</strong> of{" "}
          {MAX_COMPARE_ITEMS} floors. Add more from the catalog to compare side
          by side.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center border border-espresso px-4 py-2 text-xs font-medium tracking-wider text-espresso uppercase no-underline transition-colors hover:bg-espresso hover:text-bone"
          >
            Browse catalog
          </Link>
          {items.length > 0 ? (
            <Button
              type="button"
              onClick={clearAll}
              className="rounded-none bg-gold px-4 py-2 text-xs font-semibold tracking-wider text-espresso uppercase hover:bg-gold-light"
            >
              Clear all
            </Button>
          ) : null}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mb-6 flex items-center justify-between bg-espresso px-6 py-4">
          <p className="text-sm text-bone">
            Comparing <strong className="text-gold">{items.length}</strong>{" "}
            {items.length === 1 ? "floor" : "floors"}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer border-none bg-gold px-5 py-2 text-xs font-semibold tracking-wider text-espresso uppercase"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <CompareTable items={items} />
    </>
  );
}
