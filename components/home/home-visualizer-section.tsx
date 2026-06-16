"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { visualizerSteps } from "@/lib/home-sections";
import { cn } from "@/lib/utils";

type InstallDirection = "horizontal" | "vertical" | "diagonal";

interface HomeVisualizerSectionProps {
  products: Product[];
}

export function HomeVisualizerSection({ products }: HomeVisualizerSectionProps) {
  const swatchProducts = useMemo(() => products.slice(0, 6), [products]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<InstallDirection>("horizontal");

  const activeProduct = swatchProducts[activeIndex] ?? swatchProducts[0];
  const variant = activeProduct?.variants?.[0];
  const floorStyle =
    variant?.hexPrimary && variant?.hexSecondary
      ? {
          background: `linear-gradient(${direction === "vertical" ? "90deg" : direction === "diagonal" ? "135deg" : "0deg"}, ${variant.hexPrimary}, ${variant.hexSecondary})`,
        }
      : activeProduct?.images?.[0]?.url
        ? { backgroundImage: `url(${activeProduct.images[0].url})` }
        : undefined;

  return (
    <section id="visualizer" className="section-padding overflow-hidden bg-primary">
      <div className="section-inner">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow text-secondary">Room Visualizer</span>
            <h2 className="display-heading text-white">
              See it in your <em>space</em> first.
            </h2>
            <p className="mt-4 mb-8 max-w-lg text-base leading-relaxed text-white/75">
              Our room visualizer lets you try any floor in your own home before you
              buy. Processed on your device whenever possible - no guessing, no regrets.
            </p>

            <ol className="mb-8 space-y-3">
              {visualizerSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-secondary/50 text-[11px] text-secondary">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-3">
              <Link href="/visualizer" className="btn-gold no-underline">
                Open Full Visualizer
              </Link>
              <Link
                href="/visualizer"
                className="inline-flex items-center rounded-md border border-white/30 bg-white px-6 py-3 text-sm font-semibold tracking-wide text-primary uppercase no-underline transition-colors hover:bg-bg-light"
              >
                Upload My Room Photo
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/40">
              Processed on your device when supported - your photo stays private.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border border-white/10 bg-white/5"
          >
            <div className="relative h-[280px] overflow-hidden bg-[#1A0F08]">
              <div className="absolute top-0 right-0 left-0 h-[48%] bg-gradient-to-b from-[#2C1E12] to-[#1E1208]" />
              <div className="absolute top-5 left-1/2 h-[70px] w-24 -translate-x-1/2 border border-white/20 bg-white/10">
                <span className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
                <span className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
              </div>
              <div
                className="absolute right-0 bottom-0 left-0 h-[54%] bg-cover bg-center transition-all duration-500"
                style={floorStyle}
              />
            </div>

            <div className="p-6">
              <p className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                Select a floor
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {swatchProducts.map((product, index) => {
                  const swatch = product.variants?.[0];
                  const swatchStyle =
                    swatch?.hexPrimary && swatch?.hexSecondary
                      ? {
                          background: `linear-gradient(135deg, ${swatch.hexPrimary}, ${swatch.hexSecondary})`,
                        }
                      : product.images?.[0]?.url
                        ? { backgroundImage: `url(${product.images[0].url})` }
                        : undefined;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      aria-label={`Preview ${product.name}`}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-9 w-12 cursor-pointer border-2 bg-cover bg-center transition-colors",
                        activeIndex === index ? "border-white" : "border-transparent",
                      )}
                      style={swatchStyle}
                    />
                  );
                })}
              </div>

              <p className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                Installation direction
              </p>
              <div className="mb-6 grid grid-cols-3 gap-2">
                {(
                  [
                    ["horizontal", "Horizontal"],
                    ["vertical", "Vertical"],
                    ["diagonal", "Diagonal"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDirection(value)}
                    className={cn(
                      "cursor-pointer border px-2 py-2 text-[11px] tracking-wide uppercase transition-colors",
                      direction === value
                        ? "border-white/30 bg-white/15 text-white"
                        : "border-white/10 bg-white/5 text-white/55 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {activeProduct ? (
                  <Link
                    href={`/product/${activeProduct.slug}`}
                    className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold tracking-wide text-primary uppercase no-underline transition-colors hover:bg-bg-light"
                  >
                    Add to Cart
                  </Link>
                ) : null}
                {activeProduct ? (
                  <Link
                    href={`/samples?product=${activeProduct.slug}`}
                    className="text-sm text-white/60 underline underline-offset-4 hover:text-white"
                  >
                    Request Sample
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
