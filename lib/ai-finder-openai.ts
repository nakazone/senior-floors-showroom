import { z } from "zod";
import {
  AI_FINDER_MODEL,
  getOpenAI,
} from "@/lib/openai";
import type { AiFinderQuizAnswers } from "@/types";
import { parseRecommendedFilters } from "@/lib/ai-finder";

const aiFinderModelSchema = z.object({
  reasoning: z.string().min(1),
  recommendedProductTypes: z.array(z.string()).default([]),
  recommendedFilters: z
    .record(
      z.string(),
      z.union([z.string(), z.array(z.string()), z.boolean(), z.number()]),
    )
    .default({}),
});

const SYSTEM_PROMPT = `You are a flooring expert for Senior Floors Studio.
Recommend catalog filters for LVP and engineered hardwood products.

Catalog filter keys you may return in recommendedFilters:
- type: "LVP" | "ENGINEERED" | "HARDWOOD"
- room: living-room | bedroom | kitchen | basement | office
- style: modern | contemporary | farmhouse | scandinavian | luxury
- waterproof: boolean
- petFriendly: boolean
- minPrice: number (USD per sq ft, catalog range roughly 3-13)
- maxPrice: number (USD per sq ft)

Respond ONLY with JSON:
{
  "reasoning": "2-3 sentence friendly explanation",
  "recommendedProductTypes": ["LVP"],
  "recommendedFilters": { "waterproof": true, "room": "kitchen" }
}`;

export async function getAiFinderRecommendation(answers: AiFinderQuizAnswers) {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: AI_FINDER_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          pets: answers.pets,
          kids: answers.kids,
          room: answers.room,
          style: answers.style,
          budget: answers.budget,
        }),
      },
    ],
    temperature: 0.4,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  const parsed = aiFinderModelSchema.parse(JSON.parse(content));

  return {
    reasoning: parsed.reasoning,
    recommendedProductTypes: parsed.recommendedProductTypes,
    recommendedFilters: parseRecommendedFilters(parsed.recommendedFilters),
  };
}
