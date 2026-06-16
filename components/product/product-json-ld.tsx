import type { Product } from "@/types";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

interface ProductJsonLdProps {
  product: Product;
  ratingValue?: number;
  reviewCount?: number;
}

export function ProductJsonLd({
  product,
  ratingValue = 4.9,
  reviewCount = 12,
}: ProductJsonLdProps) {
  const image = product.images?.[0]?.url ?? `${siteConfig.url}/og-default.jpg`;
  const productUrl = absoluteUrl(`/product/${product.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: product.images?.map((entry) => entry.url) ?? [image],
        sku: product.slug,
        brand: {
          "@type": "Brand",
          name: product.series,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: product.pricePerSqFt,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: product.pricePerSqFt,
            unitCode: "FTK",
            unitText: "square foot",
          },
          availability: "https://schema.org/InStock",
          url: productUrl,
        },
        ...(reviewCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue,
                reviewCount,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shop",
            item: absoluteUrl("/shop"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
