import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoFilterCatalog } from "@/components/seo/seo-filter-catalog";
import {
  buildPageMetadata,
  getSeoFilterPage,
  styleFilterPages,
} from "@/lib/seo";

export const revalidate = 3600;

interface StylePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return styleFilterPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: StylePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoFilterPage("style", slug);

  if (!page) {
    return { title: "Flooring Collection" };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/style/${page.slug}`,
  });
}

export default async function StyleFilterPage({
  params,
  searchParams,
}: StylePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = getSeoFilterPage("style", slug);

  if (!page) {
    notFound();
  }

  return <SeoFilterCatalog page={page} searchParams={query} />;
}
