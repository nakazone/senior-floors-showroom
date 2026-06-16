import Script from "next/script";
import { analyticsConfig, isGoogleAnalyticsEnabled } from "@/lib/analytics-config";

export function GoogleAnalytics() {
  if (!isGoogleAnalyticsEnabled()) return null;

  const measurementId = analyticsConfig.gaMeasurementId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
