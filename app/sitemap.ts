import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo";
import { getAllProductSlugs } from "@/lib/products";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductSlugs();
  return getSitemapEntries(products);
}
