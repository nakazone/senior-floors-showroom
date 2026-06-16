import posthog from "posthog-js";
import type { AnalyticsEventProperties, AnalyticsItem } from "@/lib/analytics-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function cleanProperties(properties?: AnalyticsEventProperties) {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  );
}

export function trackPageView(url: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });

  if (posthog.__loaded) {
    posthog.capture("$pageview", {
      $current_url: window.location.href,
      path: url,
    });
  }
}

export function trackEvent(
  event: string,
  properties?: AnalyticsEventProperties,
) {
  if (typeof window === "undefined") return;

  const payload = cleanProperties(properties);
  window.gtag?.("event", event, payload);

  if (posthog.__loaded) {
    posthog.capture(event, payload);
  }
}

export function trackViewItem(item: AnalyticsItem & { value?: number }) {
  trackEvent("view_item", {
    currency: "USD",
    value: item.value,
    items: JSON.stringify([item]),
    item_id: item.item_id,
    item_name: item.item_name,
    item_category: item.item_category,
    price: item.price,
  });
}

export function trackAddToCart(item: AnalyticsItem & { value: number }) {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: item.value,
    items: JSON.stringify([item]),
    item_id: item.item_id,
    item_name: item.item_name,
    item_category: item.item_category,
    price: item.price,
    quantity: item.quantity,
  });
}

export function trackBeginCheckout({
  value,
  items,
}: {
  value: number;
  items: AnalyticsItem[];
}) {
  trackEvent("begin_checkout", {
    currency: "USD",
    value,
    items: JSON.stringify(items),
    item_count: items.length,
  });
}

export function trackPurchase({
  transactionId,
  value,
  items,
}: {
  transactionId: string;
  value: number;
  items: AnalyticsItem[];
}) {
  trackEvent("purchase", {
    currency: "USD",
    transaction_id: transactionId,
    value,
    items: JSON.stringify(items),
    item_count: items.length,
  });
}

export function trackGenerateLead(source: string) {
  trackEvent("generate_lead", {
    lead_source: source,
  });
}

export { posthog };
