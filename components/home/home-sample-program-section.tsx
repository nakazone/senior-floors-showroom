"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { sampleProgramPerks } from "@/lib/home-sections";
import {
  useSampleStore,
  type SampleSelectionItem,
} from "@/lib/stores/sample-store";
import { cn } from "@/lib/utils";

interface HomeSampleProgramSectionProps {
  products: Product[];
}

function productToSelection(product: Product): SampleSelectionItem {
  const variant = product.variants?.[0];

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.images?.[0]?.url,
    hexPrimary: variant?.hexPrimary,
    hexSecondary: variant?.hexSecondary,
  };
}

export function HomeSampleProgramSection({ products }: HomeSampleProgramSectionProps) {
  const items = useSampleStore((state) => state.items);
  const boxSize = useSampleStore((state) => state.boxSize);
  const toggleItem = useSampleStore((state) => state.toggleItem);
  const swatchProducts = products.slice(0, 8);

  function handleToggle(product: Product) {
    toggleItem(productToSelection(product));
  }

  return (
    <section id="samples" className="section-padding bg-bg-light">
      <div className="section-inner">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Sample Program</span>
            <h2 className="display-heading">
              Touch before <em>you decide</em>
            </h2>
            <p className="mt-4 mb-6 text-base leading-relaxed text-text-light">
              Choose a 3- or 5-sample box and receive real swatches at your door.
              Feel the texture, see the color in your light, compare against your
              furniture, then buy with confidence.
            </p>

            <p className="mb-2 text-lg font-semibold text-text-dark">
              Selected:{" "}
              <span className="text-secondary">
                {items.length} / {boxSize}
              </span>{" "}
              samples
            </p>

            <ul className="mb-6 space-y-2 text-sm text-text-muted">
              {sampleProgramPerks.map((perk) => (
                <li key={perk}>- {perk}</li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/samples" className="btn-dark no-underline">
                Order My Samples
              </Link>
              <span className="text-sm text-text-muted">Boxes from $15, or free with any order</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-4 gap-1.5">
              {swatchProducts.map((product) => {
                const selected = items.some((item) => item.productId === product.id);
                const variant = product.variants?.[0];
                const backgroundStyle =
                  variant?.hexPrimary && variant?.hexSecondary
                    ? {
                        background: `linear-gradient(135deg, ${variant.hexPrimary}, ${variant.hexSecondary})`,
                      }
                    : product.images?.[0]?.url
                      ? { backgroundImage: `url(${product.images[0].url})` }
                      : undefined;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleToggle(product)}
                    className={cn(
                      "relative aspect-square cursor-pointer overflow-hidden border bg-white p-2 text-left transition-colors",
                      selected
                        ? "border-secondary ring-2 ring-secondary/30"
                        : "border-border hover:border-primary",
                    )}
                  >
                    <div
                      className="mb-2 h-[68%] w-full bg-cream bg-cover bg-center"
                      style={backgroundStyle}
                    />
                    <p className="truncate text-[9px] font-semibold tracking-wide text-text-dark uppercase">
                      {product.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
