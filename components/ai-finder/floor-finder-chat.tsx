"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AiFinderResponse } from "@/types";
import {
  AI_FINDER_QUESTIONS,
  filtersToSearchParams,
  type AiFinderRawAnswers,
} from "@/lib/ai-finder";
import { AiResultCard } from "@/components/ai-finder/ai-result-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { toast } from "@/components/shared/toast-provider";

const emptyAnswers = AI_FINDER_QUESTIONS.reduce((answers, question) => {
  answers[question.id] = "";
  return answers;
}, {} as AiFinderRawAnswers);

export function FloorFinderChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AiFinderRawAnswers>(emptyAnswers);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiFinderResponse | null>(null);

  const currentQuestion = AI_FINDER_QUESTIONS[step];
  const isComplete = step >= AI_FINDER_QUESTIONS.length;

  const shopHref = useMemo(() => {
    if (!result) return "/shop";
    const query = filtersToSearchParams(result.recommendedFilters);
    return query ? `/shop?${query}` : "/shop";
  }, [result]);

  function handleAnswer(value: string) {
    if (!currentQuestion) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    if (step + 1 >= AI_FINDER_QUESTIONS.length) {
      void submitQuiz(nextAnswers);
      setStep(AI_FINDER_QUESTIONS.length);
      return;
    }

    setStep((current) => current + 1);
  }

  async function submitQuiz(nextAnswers: AiFinderRawAnswers) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextAnswers),
      });

      const data = (await response.json()) as AiFinderResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to get recommendations");
      }

      setResult(data);
      trackEvent("ai_finder_completed", {
        product_count: data.products.length,
        recommended_types: data.recommendedProductTypes.join(","),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to get recommendations",
      );
      setStep(AI_FINDER_QUESTIONS.length - 1);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers(emptyAnswers);
    setResult(null);
  }

  return (
    <div className="bg-espresso p-8 md:p-12">
      <p className="mb-2 font-serif text-[28px] font-light text-bone">
        Floor Finder Quiz
      </p>
      <p className="mb-8 text-sm text-bone/55">
        Answer 5 quick questions to get your perfect match.
      </p>

      <div className="mb-8 flex gap-1.5">
        {AI_FINDER_QUESTIONS.map((question, index) => (
          <span
            key={question.id}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index <= step || isComplete ? "bg-gold" : "bg-bone/20",
            )}
          />
        ))}
      </div>

      {!isComplete && currentQuestion ? (
        <div>
          <p className="mb-4 text-sm text-bone/80">{currentQuestion.question}</p>
          <div className="flex flex-wrap gap-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className="cursor-pointer border border-bone/15 bg-bone/7 px-4 py-2 text-sm text-bone/70 transition-colors hover:bg-bone/14 hover:text-bone"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isComplete ? (
        <div>
          {isLoading ? (
            <div className="space-y-3 py-6">
              <div className="h-4 w-2/3 animate-pulse bg-bone/10" />
              <div className="h-4 w-full animate-pulse bg-bone/10" />
              <div className="h-4 w-5/6 animate-pulse bg-bone/10" />
            </div>
          ) : result ? (
            <>
              <p className="mb-4 font-serif text-xl font-light text-bone">
                Based on your answers, we recommend:
              </p>
              <p className="mb-6 text-sm leading-relaxed text-bone/70">
                {result.reasoning}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.products.map((product) => (
                  <AiResultCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={shopHref}
                  className="inline-flex flex-1 items-center justify-center bg-bone px-4 py-3 text-sm font-medium tracking-wide text-espresso uppercase no-underline"
                >
                  Browse matching floors
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRestart}
                  className="flex-1 rounded-none border-bone/30 bg-transparent text-bone hover:bg-bone/10 hover:text-bone"
                >
                  Start over
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
