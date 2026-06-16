"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";
import {
  filterHomeCatalogProducts,
  homeCatalogFilterGroups,
  type HomeCatalogFilterId,
} from "@/lib/home-sections";
import { cn } from "@/lib/utils";

interface HomeCatalogPreviewProps {
  products: Product[];
}

export function HomeCatalogPreview({ products }: HomeCatalogPreviewProps) {
  const [activeFilter, setActiveFilter] = useState<HomeCatalogFilterId>("all");

  const filteredProducts = useMemo(
    () => filterHomeCatalogProducts(products, activeFilter).slice(0, 8),
    [products, activeFilter],
  );

  return (
    <section id="catalog" className="section-padding bg-white">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-10 md:flex-row md:items-end"
        >
          <div>
            <span className="eyebrow">Full Catalog</span>
            <h2 className="display-heading">
              Find your <em>perfect floor</em>
            </h2>
            <p className="mt-4 max-w-2xl text-text-light">
              Filter by material, color tone and features. Every result links to the
              full shop with shareable URLs.
            </p>
          </div>
          <Link href="/compare" className="btn-outline inline-flex items-center gap-2 no-underline">
            <Scale className="h-4 w-4" />
            Compare Floors
          </Link>
        </motion.div>

        <div
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center"
          role="group"
          aria-label="Catalog filters"
        >
          {homeCatalogFilterGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-wrap items-center gap-2">
              {groupIndex > 0 ? (
                <span className="mx-1 hidden h-5 w-px bg-border lg:inline-block" aria-hidden />
              ) : null}
              {group.chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveFilter(chip.id)}
                  className={cn(
                    "cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                    activeFilter === chip.id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-bg-light text-text-light hover:border-primary hover:text-primary",
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border bg-bg-light px-6 py-12 text-center">
            <p className="text-text-light">No floors match this filter yet.</p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="btn-gold mt-4"
            >
              Show All Floors
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/shop" className="btn-dark no-underline">
            Browse Full Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
