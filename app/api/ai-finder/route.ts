import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AI_FINDER_QUESTIONS,
  buildFallbackFilters,
  buildFallbackReasoning,
  isOpenAIConfigured,
  normalizeQuizAnswers,
  pickRecommendedProducts,
  type AiFinderRawAnswers,
} from "@/lib/ai-finder";
import { getAiFinderRecommendation } from "@/lib/ai-finder-openai";
import { searchCatalogProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const answerShape = AI_FINDER_QUESTIONS.reduce(
  (shape, question) => {
    shape[question.id] = z.string().min(1);
    return shape;
  },
  {} as Record<string, z.ZodString>,
);

const aiFinderRequestSchema = z.object(answerShape);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = aiFinderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid quiz answers", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const answers = normalizeQuizAnswers(parsed.data as AiFinderRawAnswers);

  try {
    let reasoning = buildFallbackReasoning(answers);
    let recommendedProductTypes: string[] = [];
    let filters = buildFallbackFilters(answers);

    if (isOpenAIConfigured()) {
      try {
        const aiResult = await getAiFinderRecommendation(answers);
        reasoning = aiResult.reasoning;
        recommendedProductTypes = aiResult.recommendedProductTypes;
        filters = {
          ...filters,
          ...aiResult.recommendedFilters,
        };
      } catch (error) {
        console.error("AI Floor Finder OpenAI error:", error);
      }
    }

    const products = await searchCatalogProducts(filters);
    const recommendations = pickRecommendedProducts(products, 3);

    if (recommendations.length === 0) {
      const fallbackProducts = await searchCatalogProducts(
        buildFallbackFilters(answers),
      );
      const relaxed = pickRecommendedProducts(fallbackProducts, 3);

      return NextResponse.json({
        reasoning,
        recommendedProductTypes:
          recommendedProductTypes.length > 0
            ? recommendedProductTypes
            : [filters.type ?? "LVP"],
        recommendedFilters: filters,
        products: relaxed,
        source: isOpenAIConfigured() ? "fallback" : "rules",
      });
    }

    return NextResponse.json({
      reasoning,
      recommendedProductTypes:
        recommendedProductTypes.length > 0
          ? recommendedProductTypes
          : [filters.type ?? "LVP"],
      recommendedFilters: filters,
      products: recommendations,
      source: isOpenAIConfigured() ? "openai" : "rules",
    });
  } catch (error) {
    console.error("AI Floor Finder error:", error);
    return NextResponse.json(
      { error: "Unable to generate recommendations" },
      { status: 500 },
    );
  }
}
