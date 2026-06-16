"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { featuredCollections } from "@/lib/home-data";
import { ArrowRight } from "lucide-react";

export function FeaturedCollections() {
  return (
    <section className="section-padding bg-white">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center md:mb-16"
        >
          <span className="eyebrow">Featured Collections</span>
          <h2 className="display-heading">
            Curated for <em>every space</em>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredCollections.map((collection, index) => (
            <motion.article
              key={collection.href}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <Link
                href={collection.href}
                className="group relative block min-h-[380px] overflow-hidden bg-bone no-underline"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} transition-transform duration-700 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_3px)]" />
                <div className="relative flex h-full flex-col justify-end p-8">
                  <p className="mb-2 text-[11px] tracking-[0.14em] text-gold uppercase">
                    {collection.subtitle}
                  </p>
                  <h3 className="mb-3 font-serif text-3xl text-espresso">
                    {collection.title}
                  </h3>
                  <p className="mb-6 max-w-xs text-sm leading-relaxed text-walnut">
                    {collection.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wider text-espresso uppercase transition-colors group-hover:text-gold">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
