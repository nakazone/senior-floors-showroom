import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoFilterCatalog } from "@/components/seo/seo-filter-catalog";
import {
  buildPageMetadata,
  colorFilterPages,
  getSeoFilterPage,
} from "@/lib/seo";

export const revalidate = 3600;

interface ColorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return colorFilterPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: ColorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoFilterPage("color", slug);

  if (!page) {
    return { title: "Flooring Collection" };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/color/${page.slug}`,
  });
}

export default async function ColorFilterPage({
  params,
  searchParams,
}: ColorPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = getSeoFilterPage("color", slug);

  if (!page) {
    notFound();
  }

  return <SeoFilterCatalog page={page} searchParams={query} />;
}
