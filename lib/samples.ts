export const MAX_SAMPLES = 3;

export function getSampleUnitPrice(): number {
  const value = Number(process.env.SAMPLE_UNIT_PRICE ?? 5);
  return Number.isFinite(value) && value >= 0 ? value : 5;
}

export function calculateSampleTotal(
  sampleCount: number,
  options: { freeWithOrder?: boolean } = {},
) {
  const unitPrice = getSampleUnitPrice();

  if (unitPrice <= 0 || sampleCount <= 0) {
    return 0;
  }

  if (options.freeWithOrder) {
    return 0;
  }

  return sampleCount * unitPrice;
}

export type SamplePayloadItem = {
  productId: string;
};

export function serializeSamplePayload(productIds: string[]) {
  const payload: SamplePayloadItem[] = productIds.map((productId) => ({
    productId,
  }));

  return JSON.stringify(payload);
}

export function parseSamplePayload(raw: string | null | undefined) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as SamplePayloadItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => entry.productId)
      .filter((productId) => typeof productId === "string" && productId.length > 0);
  } catch {
    return [];
  }
}
