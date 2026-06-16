import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/site-layout";
import { privateRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = privateRouteMetadata;

export default function AccountGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
