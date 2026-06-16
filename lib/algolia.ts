import { algoliasearch, type SearchClient } from "algoliasearch";

export const PRODUCTS_INDEX =
  process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX ?? "products";

let adminClient: SearchClient | null = null;
let searchClient: SearchClient | null = null;

export function isAlgoliaConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  );
}

export function isAlgoliaAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
      process.env.ALGOLIA_ADMIN_API_KEY,
  );
}

export function getAlgoliaAdminClient(): SearchClient {
  if (!adminClient) {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;

    if (!appId || !apiKey) {
      throw new Error("Algolia admin credentials are not configured");
    }

    adminClient = algoliasearch(appId, apiKey);
  }

  return adminClient;
}

export function getAlgoliaSearchClient(): SearchClient {
  if (!searchClient) {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

    if (!appId || !apiKey) {
      throw new Error("Algolia search credentials are not configured");
    }

    searchClient = algoliasearch(appId, apiKey);
  }

  return searchClient;
}

/** @deprecated Use getAlgoliaAdminClient() */
export function getAlgoliaClient(): SearchClient {
  return getAlgoliaAdminClient();
}
