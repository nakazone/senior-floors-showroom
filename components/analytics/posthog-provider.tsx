"use client";

import { useEffect } from "react";
import { analyticsConfig, isPostHogEnabled } from "@/lib/analytics-config";
import { posthog } from "@/lib/analytics";

export function PostHogProvider() {
  useEffect(() => {
    if (!isPostHogEnabled() || posthog.__loaded) return;

    posthog.init(analyticsConfig.posthogKey, {
      api_host: analyticsConfig.posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
  }, []);

  return null;
}
