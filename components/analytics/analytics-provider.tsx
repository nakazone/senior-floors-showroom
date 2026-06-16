import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { isAnalyticsEnabled } from "@/lib/analytics-config";

export function AnalyticsProvider() {
  if (!isAnalyticsEnabled()) return null;

  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <PostHogProvider />
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  );
}
