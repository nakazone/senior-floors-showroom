import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoFilterCatalog } from "@/components/seo/seo-filter-catalog";
import {
  buildPageMetadata,
  getSeoFilterPage,
  roomFilterPages,
} from "@/lib/seo";

export const revalidate = 3600;

interface RoomPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return roomFilterPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoFilterPage("room", slug);

  if (!page) {
    return { title: "Flooring Collection" };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/room/${page.slug}`,
  });
}

export default async function RoomFilterPage({
  params,
  searchParams,
}: RoomPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = getSeoFilterPage("room", slug);

  if (!page) {
    notFound();
  }

  return <SeoFilterCatalog page={page} searchParams={query} />;
}
