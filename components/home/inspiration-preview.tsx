"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { HomeGalleryItem } from "@/lib/home";

interface InspirationPreviewProps {
  items: HomeGalleryItem[];
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function InspirationPreview({ items }: InspirationPreviewProps) {
  return (
    <section className="section-padding bg-bone">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end"
        >
          <div>
            <span className="eyebrow">Inspiration Gallery</span>
            <h2 className="display-heading">
              Real rooms, <em>real floors</em>
            </h2>
          </div>
          <Link href="/inspiration" className="btn-outline no-underline">
            View Full Gallery
          </Link>
        </motion.div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="mb-5 break-inside-avoid"
            >
              <Link
                href="/inspiration"
                className="group relative block overflow-hidden bg-espresso no-underline"
              >
                <div
                  className={`relative w-full ${
                    index % 3 === 0 ? "h-[420px]" : index % 3 === 1 ? "h-[320px]" : "h-[380px]"
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={`${formatLabel(item.roomType)} - ${formatLabel(item.style)}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                </div>
                <div className="absolute right-0 bottom-0 left-0 p-5">
                  <p className="text-[10px] tracking-[0.14em] text-gold uppercase">
                    {formatLabel(item.roomType)} | {formatLabel(item.style)}
                  </p>
                  {item.productName ? (
                    <p className="mt-1 font-serif text-lg text-bone">
                      {item.productName}
                    </p>
                  ) : null}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
