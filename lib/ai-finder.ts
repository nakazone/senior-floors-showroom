import type { AiFinderQuizAnswers, Product } from "@/types";
import type { CatalogFilters } from "@/types/catalog";

export const AI_FINDER_QUESTIONS = [
  {
    id: "pets",
    question: "Do you have pets?",
    options: [
      { label: "No pets", value: "none" },
      { label: "Small dogs / cats", value: "small" },
      { label: "Large dogs", value: "large" },
      { label: "Multiple pets", value: "multiple" },
    ],
  },
  {
    id: "kids",
    question: "Do you have children in the home?",
    options: [
      { label: "No children", value: "none" },
      { label: "Toddlers", value: "toddlers" },
      { label: "School-age kids", value: "school" },
      { label: "Teenagers", value: "teen" },
    ],
  },
  {
    id: "room",
    question: "Which room are you flooring?",
    options: [
      { label: "Living room", value: "living-room" },
      { label: "Bedroom", value: "bedroom" },
      { label: "Basement", value: "basement" },
      { label: "Kitchen / Bath", value: "kitchen" },
    ],
  },
  {
    id: "style",
    question: "What is your style preference?",
    options: [
      { label: "Modern / Minimal", value: "modern" },
      { label: "Farmhouse / Rustic", value: "farmhouse" },
      { label: "Scandinavian", value: "scandinavian" },
      { label: "Luxury / Classic", value: "luxury" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget per sq ft?",
    options: [
      { label: "Under $5", value: "economy" },
      { label: "$5 - $8", value: "mid" },
      { label: "$8 - $11", value: "premium" },
      { label: "$11+", value: "luxury" },
    ],
  },
] as const;

export type AiFinderRawAnswers = Record<
  (typeof AI_FINDER_QUESTIONS)[number]["id"],
  string
>;

export function normalizeQuizAnswers(raw: AiFinderRawAnswers): AiFinderQuizAnswers {
  return {
    pets: raw.pets !== "none",
    kids: raw.kids !== "none",
    room: raw.room,
    style: raw.style,
    budget: raw.budget,
  };
}

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

const budgetRanges: Record<string, { minPrice?: number; maxPrice?: number }> = {
  economy: { maxPrice: 5 },
  mid: { minPrice: 5, maxPrice: 8 },
  premium: { minPrice: 8, maxPrice: 11 },
  luxury: { minPrice: 11 },
};

export function buildFallbackFilters(answers: AiFinderQuizAnswers): CatalogFilters {
  const filters: CatalogFilters = {
    room: answers.room,
    style: answers.style,
    ...budgetRanges[answers.budget],
  };

  const needsDurableSurface =
    answers.pets ||
    answers.kids ||
    answers.room === "basement" ||
    answers.room === "kitchen";

  if (needsDurableSurface) {
    filters.type = "LVP";
    filters.waterproof = true;
  } else {
    filters.type = "ENGINEERED";
  }

  if (answers.pets) {
    filters.petFriendly = true;
  }

  return filters;
}

export function buildFallbackReasoning(answers: AiFinderQuizAnswers) {
  const parts: string[] = [];

  if (answers.pets) {
    parts.push("pet-friendly and scratch-resistant flooring");
  }

  if (answers.kids) {
    parts.push("durable surfaces for active family life");
  }

  if (answers.room === "basement" || answers.room === "kitchen") {
    parts.push("waterproof protection for moisture-prone spaces");
  }

  if (answers.style) {
    parts.push(`a ${answers.style.replace("-", " ")} aesthetic`);
  }

  if (parts.length === 0) {
    return "Based on your answers, we prioritized versatile engineered hardwood with balanced performance and style.";
  }

  return `Based on your answers, we prioritized ${parts.join(", ")}.`;
}

export function parseRecommendedFilters(
  value:
    | Record<string, string | string[] | boolean | number>
    | undefined,
): CatalogFilters {
  if (!value) return {};

  const filters: CatalogFilters = {};

  if (typeof value.type === "string") {
    const type = value.type.toUpperCase();
    if (type === "LVP" || type === "ENGINEERED" || type === "HARDWOOD") {
      filters.type = type;
    }
  }

  if (typeof value.colorFamily === "string") filters.colorFamily = value.colorFamily;
  if (typeof value.room === "string") filters.room = value.room;
  if (typeof value.style === "string") filters.style = value.style;
  if (typeof value.installType === "string") filters.installType = value.installType;
  if (typeof value.waterproof === "boolean") filters.waterproof = value.waterproof;
  if (typeof value.petFriendly === "boolean") filters.petFriendly = value.petFriendly;
  if (typeof value.minPrice === "number") filters.minPrice = value.minPrice;
  if (typeof value.maxPrice === "number") filters.maxPrice = value.maxPrice;
  if (typeof value.minPrice === "string") {
    const parsed = Number(value.minPrice);
    if (Number.isFinite(parsed)) filters.minPrice = parsed;
  }
  if (typeof value.maxPrice === "string") {
    const parsed = Number(value.maxPrice);
    if (Number.isFinite(parsed)) filters.maxPrice = parsed;
  }

  return filters;
}

export function filtersToSearchParams(filters: CatalogFilters) {
  const params = new URLSearchParams();

  if (filters.type) params.set("material", filters.type);
  if (filters.colorFamily) params.set("color", filters.colorFamily);
  if (filters.room) params.set("room", filters.room);
  if (filters.style) params.set("style", filters.style);
  if (filters.waterproof) params.set("waterproof", "1");
  if (filters.petFriendly) params.set("petFriendly", "1");
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));

  return params.toString();
}

export function pickRecommendedProducts(products: Product[], limit = 3) {
  return products.slice(0, limit);
}
