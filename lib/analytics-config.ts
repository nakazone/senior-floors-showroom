export type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | undefined
>;

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
};

export const analyticsConfig = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
} as const;

export function isGoogleAnalyticsEnabled() {
  return Boolean(analyticsConfig.gaMeasurementId);
}

export function isClarityEnabled() {
  return Boolean(analyticsConfig.clarityProjectId);
}

export function isPostHogEnabled() {
  return Boolean(analyticsConfig.posthogKey);
}

export function isAnalyticsEnabled() {
  return (
    isGoogleAnalyticsEnabled() ||
    isClarityEnabled() ||
    isPostHogEnabled()
  );
}
