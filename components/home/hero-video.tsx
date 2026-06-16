"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { heroSlides } from "@/lib/home-data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 8000;

export function HeroVideo() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(goToNext, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [goToNext, prefersReducedMotion]);

  const activeSlide = heroSlides[activeIndex];
  const hasVideo =
    Boolean(activeSlide.videoUrl) &&
    !videoErrors[activeSlide.id] &&
    !prefersReducedMotion;
  const motionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.2, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-height)]"
      aria-label="Hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={motionTransition}
            className="absolute inset-0"
          >
            {hasVideo ? (
              <video
                key={activeSlide.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                poster={activeSlide.posterUrl}
                onError={() =>
                  setVideoErrors((prev) => ({ ...prev, [activeSlide.id]: true }))
                }
                className="h-full w-full object-cover"
              >
                <source src={activeSlide.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <>
                <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-5">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`relative bg-gradient-to-b ${slide.gradient}`}
                      style={
                        prefersReducedMotion
                          ? undefined
                          : {
                              transform: `translateY(${(index % 2 === 0 ? 1 : -1) * (20 + index * 8)}px)`,
                            }
                      }
                    >
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_28px,rgba(0,0,0,0.04)_28px,rgba(0,0,0,0.04)_30px)]" />
                    </div>
                  ))}
                </div>
                <Image
                  src={activeSlide.posterUrl}
                  alt=""
                  fill
                  priority
                  className="object-cover opacity-40"
                  sizes="100vw"
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,13,7,0.82)] via-[rgba(20,13,7,0.55)] to-[rgba(20,13,7,0.2)]" />
      </div>

      <div className="relative z-10 w-full max-w-[780px] px-6 md:px-16">
        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.22em] text-gold-light uppercase"
        >
          <span className="h-px w-8 bg-gold" />
          {siteConfig.name} | Est. 2025
        </motion.p>

        <motion.h1
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: prefersReducedMotion ? 0 : 0.35 }}
          className="mb-6 font-serif text-[clamp(2.5rem,8vw,6.25rem)] leading-[0.98] font-light tracking-tight text-white"
        >
          Luxury
          <br />
          Flooring,
          <br />
          <em className="text-gold-light not-italic">Reimagined.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.5 }}
          className="mb-11 max-w-lg text-base font-light text-bone/75 md:text-lg"
        >
          Explore, visualize and order premium flooring from the comfort of your home.
        </motion.p>

        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.65 }}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Link href="/shop" className="btn-gold px-8 py-4 text-center text-sm no-underline sm:px-10">
            Shop Flooring
          </Link>
          <Link
            href="/visualizer"
            className="inline-block border border-bone/40 px-8 py-4 text-center text-sm tracking-wider text-bone uppercase no-underline transition-colors hover:border-bone/70 hover:bg-bone/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold sm:px-10"
          >
            Visualize In Your Room
          </Link>
        </motion.div>

        <p className="mt-8 text-[11px] tracking-[0.18em] text-bone/45 uppercase">
          Now featuring: {activeSlide.label}
        </p>
      </div>

      <div
        className="absolute right-6 bottom-28 z-10 hidden gap-8 md:right-16 md:flex md:gap-10"
        aria-hidden="true"
      >
        {[
          { value: "200+", label: "Styles" },
          { value: "48h", label: "Sample Delivery" },
          { value: "5\u2605", label: "Rated" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-serif text-3xl font-light text-white md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] tracking-widest text-bone/50 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        role="tablist"
        aria-label="Hero featured collections"
      >
        <div className="flex items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${slide.label}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2.5 w-2.5 cursor-pointer rounded-full border border-bone/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                index === activeIndex ? "bg-gold" : "bg-transparent",
              )}
            />
          ))}
        </div>
        {!prefersReducedMotion ? (
          <div className="flex flex-col items-center gap-2 text-[11px] tracking-[0.14em] text-bone/40 uppercase">
            <div className="h-10 w-px animate-pulse bg-gradient-to-b from-transparent to-bone/40" />
            <span>Scroll</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
