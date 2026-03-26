import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/shopify"

export const revalidate = 86400

const BASE_URL = "https://www.saltandstone.com.au"

// NOTE: Add any new static pages here manually when created
// Products are handled dynamically below
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE_URL}/shop`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/about`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/contact`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/faq`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
  { url: `${BASE_URL}/policies/shipping`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
  { url: `${BASE_URL}/policies/privacy`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
  { url: `${BASE_URL}/policies/terms`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
  { url: `${BASE_URL}/policies/returns`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5 },
]

// Collection landing pages — must match keys in lib/collection-config.ts
const COLLECTION_SLUGS = [
  "bath-salts",
  "body-scrubs",
  "essential-oils",
  "candles",
  "hand-wash",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Products from Shopify
    const products = await getProducts({ first: 250 })
    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/shop/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const collectionUrls: MetadataRoute.Sitemap = COLLECTION_SLUGS.map((slug) => ({
      url: `${BASE_URL}/collections/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }))

    return [...STATIC_PAGES, ...collectionUrls, ...productUrls]
  } catch (err) {
    console.error("[sitemap] Failed to generate full sitemap:", err)
    // Return a minimal valid sitemap so the route doesn't 500
    return STATIC_PAGES
  }
}
