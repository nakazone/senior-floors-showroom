"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { MAX_SAMPLES } from "@/lib/samples";
import { sampleProgramPerks } from "@/lib/home-sections";
import {
  useSampleStore,
  type SampleSelectionItem,
} from "@/lib/stores/sample-store";
import { toast } from "@/components/shared/toast-provider";
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
  const toggleItem = useSampleStore((state) => state.toggleItem);
  const swatchProducts = products.slice(0, 8);

  function handleToggle(product: Product) {
    const result = toggleItem(productToSelection(product));

    if (result === "added") {
      toast.success(`${product.name} added to samples`);
      return;
    }

    if (result === "removed") {
      toast.message(`${product.name} removed from samples`);
      return;
    }

    toast.error(`You can select up to ${MAX_SAMPLES} samples per order`);
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
              Order up to 3 physical samples and receive them at your door. Feel the
              texture, see the color in your light, compare against your furniture,
              then buy with confidence.
            </p>

            <p className="mb-2 text-lg font-semibold text-text-dark">
              Selected:{" "}
              <span className="text-secondary">
                {items.length} / {MAX_SAMPLES}
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
              <span className="text-sm text-text-muted">$5/ea or free with any order</span>
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
                      "aspect-square cursor-pointer border p-2 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-text-dark hover:border-primary",
                    )}
                  >
                    <div
                      className="mb-2 h-[68%] w-full bg-cream bg-cover bg-center"
                      style={backgroundStyle}
                    />
                    <p className="truncate text-[9px] font-semibold tracking-wide uppercase">
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
