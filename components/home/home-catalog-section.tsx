import { getFeaturedProducts } from "@/lib/products";
import { HomeCatalogPreview } from "@/components/home/home-catalog-preview";

export async function HomeCatalogSection() {
  const products = await getFeaturedProducts(12);

  return <HomeCatalogPreview products={products} />;
}
