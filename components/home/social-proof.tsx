"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { HomeReview } from "@/lib/home";

interface SocialProofProps {
  reviews: HomeReview[];
  ratingValue: number;
  reviewCount: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < rating
              ? "fill-secondary text-secondary"
              : "fill-transparent text-border"
          }`}
        />
      ))}
    </div>
  );
}

export function SocialProof({
  reviews,
  ratingValue,
  reviewCount,
}: SocialProofProps) {
  return (
    <section className="section-padding bg-bg-light">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        >
          <div>
            <span className="eyebrow">Customer Reviews</span>
            <h2 className="display-heading">
              Trusted by <em>homeowners</em>
            </h2>
          </div>
          <div className="text-left md:text-right">
            <p className="text-5xl font-bold text-text-dark">{ratingValue.toFixed(1)}</p>
            <Stars rating={Math.round(ratingValue)} />
            <p className="mt-2 text-sm text-text-light">
              Based on {reviewCount.toLocaleString()} verified reviews
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.blockquote
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="sf-testimonial-card"
            >
              <Stars rating={review.rating} />
              <p className="mt-4 text-[15px] leading-relaxed text-text-light">
                &ldquo;{review.comment}&rdquo;
              </p>
              <footer className="mt-6 flex items-center justify-between gap-4">
                <cite className="font-semibold text-text-dark not-italic">
                  {review.customerName}
                </cite>
                {review.verified ? (
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-success uppercase">
                    Verified Purchase
                  </span>
                ) : null}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
