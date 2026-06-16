import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

interface CatalogJsonLdProps {
  name: string;
  description: string;
  path: string;
}

export function CatalogJsonLd({ name, description, path }: CatalogJsonLdProps) {
  const url = absoluteUrl(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name,
        description,
        url,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
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
            name,
            item: url,
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
