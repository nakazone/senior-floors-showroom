import { getFeaturedProducts } from "@/lib/products";
import { HomeVisualizerSection } from "@/components/home/home-visualizer-section";
import { HomeSampleProgramSection } from "@/components/home/home-sample-program-section";

export async function HomeVisualizerBlock() {
  const products = await getFeaturedProducts(12);
  return <HomeVisualizerSection products={products} />;
}

export async function HomeSampleProgramBlock() {
  const products = await getFeaturedProducts(12);
  return <HomeSampleProgramSection products={products} />;
}
