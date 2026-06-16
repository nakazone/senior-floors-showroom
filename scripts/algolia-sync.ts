import { syncProductsToAlgolia } from "@/lib/algolia-products";
import { isAlgoliaAdminConfigured } from "@/lib/algolia";

async function main() {
  if (!isAlgoliaAdminConfigured()) {
    console.error(
      "Missing NEXT_PUBLIC_ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY.",
    );
    process.exit(1);
  }

  const result = await syncProductsToAlgolia();
  console.log(`Indexed ${result.indexed} products to Algolia.`);
}

main().catch((error) => {
  console.error("Algolia sync failed:", error);
  process.exit(1);
});
