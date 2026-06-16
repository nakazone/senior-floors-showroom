import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetailPanel } from "@/components/product/product-detail-panel";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { ViewItemTracker } from "@/components/analytics/view-item-tracker";
import { RelatedProducts } from "@/components/product/related-products";
import {
  getAllProductSlugs,
  getProductBySlug,
  getProductReviewStats,
  getRelatedProducts,
} from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.images?.[0]?.url,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, reviewStats] = await Promise.all([
    getRelatedProducts(product, 4),
    getProductReviewStats(product.id),
  ]);

  return (
    <>
      <ViewItemTracker product={product} />
      <ProductJsonLd
        product={product}
        ratingValue={reviewStats.ratingValue}
        reviewCount={reviewStats.reviewCount}
      />
      <main className="bg-white pt-[calc(var(--nav-height)+1rem)]">
        <div className="section-inner border-b border-cream py-4 text-sm text-walnut">
          <Link href="/" className="no-underline hover:text-espresso">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="no-underline hover:text-espresso">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-espresso">{product.name}</span>
        </div>

        <div className="section-inner grid gap-0 lg:grid-cols-2 lg:gap-10">
          <ProductGallery images={product.images ?? []} productName={product.name} />
          <ProductDetailPanel product={product} />
        </div>

        <RelatedProducts products={relatedProducts} />
      </main>
    </>
  );
}
