"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AI_FINDER_QUESTIONS } from "@/lib/ai-finder";
import { cn } from "@/lib/utils";

export function HomeAiFinderSection() {
  const previewQuestion = AI_FINDER_QUESTIONS[0];

  return (
    <section id="ai-finder" className="section-padding bg-white">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="eyebrow">AI Floor Finder</span>
          <h2 className="display-heading">
            Let AI find your <em>ideal floor</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-light">
            Answer a few questions and our AI recommends the perfect flooring for your
            lifestyle, room and budget - just like talking to an expert.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-2xl bg-primary p-8 md:p-10"
        >
          <h3 className="text-2xl font-bold text-white">Floor Finder Quiz</h3>
          <p className="mt-2 text-sm text-white/60">
            Answer {AI_FINDER_QUESTIONS.length} quick questions to get your perfect match.
          </p>

          <div className="my-6 flex gap-1.5" aria-hidden>
            {AI_FINDER_QUESTIONS.map((question, index) => (
              <span
                key={question.id}
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === 0 ? "bg-secondary" : "bg-white/20",
                )}
              />
            ))}
          </div>

          {previewQuestion ? (
            <div className="mb-8">
              <p className="mb-3 text-sm text-white/85">{previewQuestion.question}</p>
              <div className="flex flex-wrap gap-2">
                {previewQuestion.options.slice(0, 4).map((option) => (
                  <span
                    key={option.value}
                    className="rounded-md border border-white/15 bg-white/8 px-3 py-2 text-sm text-white/75"
                  >
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <Link href="/ai-finder" className="btn-gold block w-full text-center no-underline">
            Start Floor Finder
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
