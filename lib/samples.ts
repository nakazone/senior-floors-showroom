export const SAMPLE_BOX_SIZES = [3, 5] as const;

export type SampleBoxSize = (typeof SAMPLE_BOX_SIZES)[number];

export const DEFAULT_SAMPLE_BOX_SIZE: SampleBoxSize = 3;

/** Upper bound for validation across all box sizes. */
export const MAX_SAMPLE_BOX_SIZE: SampleBoxSize = 5;

/** @deprecated Use getMaxSamples(boxSize) instead. */
export const MAX_SAMPLES = MAX_SAMPLE_BOX_SIZE;

export function getMaxSamples(boxSize: SampleBoxSize = DEFAULT_SAMPLE_BOX_SIZE) {
  return boxSize;
}

export function getSampleBoxPrice(boxSize: SampleBoxSize): number {
  if (boxSize === 3) {
    const value = Number(process.env.SAMPLE_BOX_3_PRICE ?? 15);
    return Number.isFinite(value) && value >= 0 ? value : 15;
  }

  const value = Number(process.env.SAMPLE_BOX_5_PRICE ?? 20);
  return Number.isFinite(value) && value >= 0 ? value : 20;
}

/** Legacy per-sample unit price (used only for display fallback). */
export function getSampleUnitPrice(): number {
  const value = Number(process.env.SAMPLE_UNIT_PRICE ?? 5);
  return Number.isFinite(value) && value >= 0 ? value : 5;
}

export function calculateSampleTotal(
  sampleCount: number,
  options: { freeWithOrder?: boolean; boxSize?: SampleBoxSize } = {},
) {
  if (sampleCount <= 0) {
    return 0;
  }

  if (options.freeWithOrder) {
    return 0;
  }

  const boxSize = options.boxSize ?? DEFAULT_SAMPLE_BOX_SIZE;
  return getSampleBoxPrice(boxSize);
}

export type SamplePayloadItem = {
  productId: string;
};

export function serializeSamplePayload(
  productIds: string[],
  boxSize: SampleBoxSize = DEFAULT_SAMPLE_BOX_SIZE,
) {
  return JSON.stringify({
    boxSize,
    items: productIds.map((productId) => ({ productId })),
  });
}

export function parseSamplePayload(raw: string | null | undefined) {
  if (!raw) return { productIds: [] as string[], boxSize: DEFAULT_SAMPLE_BOX_SIZE };

  try {
    const parsed = JSON.parse(raw) as
      | SamplePayloadItem[]
      | { boxSize?: SampleBoxSize; items?: SamplePayloadItem[] };

    if (Array.isArray(parsed)) {
      return {
        productIds: parsed
          .map((entry) => entry.productId)
          .filter((productId) => typeof productId === "string" && productId.length > 0),
        boxSize: DEFAULT_SAMPLE_BOX_SIZE,
      };
    }

    const boxSize =
      parsed.boxSize === 5 || parsed.boxSize === 3
        ? parsed.boxSize
        : DEFAULT_SAMPLE_BOX_SIZE;

    const productIds = (parsed.items ?? [])
      .map((entry) => entry.productId)
      .filter((productId) => typeof productId === "string" && productId.length > 0);

    return { productIds, boxSize };
  } catch {
    return { productIds: [] as string[], boxSize: DEFAULT_SAMPLE_BOX_SIZE };
  }
}

export const sampleBoxOptions: {
  size: SampleBoxSize;
  title: string;
  description: string;
  badge?: string;
}[] = [
  {
    size: 3,
    title: "Sample Box — 3 swatches",
    description: "Compare three favorites in your space before you commit.",
  },
  {
    size: 5,
    title: "Sample Box — 5 swatches",
    description: "Our most popular box for whole-home color decisions.",
    badge: "Best value",
  },
];
