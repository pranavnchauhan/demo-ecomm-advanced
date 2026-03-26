// Judge.me API client — all fetches are server-side only
const SHOP_DOMAIN =
  process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN ?? "salt-and-stone-au.myshopify.com"
const PRIVATE_TOKEN = process.env.JUDGEME_PRIVATE_TOKEN ?? ""
const BASE = "https://judge.me/api/v1"

export type JudgeMeReview = {
  id: number
  title: string | null
  body: string
  rating: number
  reviewer: {
    name: string
    tags?: string[]
  }
  verified: "buyer" | "unverified" | "incentivised" | "staff" | "imported" | null
  created_at: string
  pictures: Array<{
    urls: { compact: string; original: string }
  }>
}

export type JudgeMeRating = {
  average: number
  count: number
}

export type JudgeMeReviewsData = {
  reviews: JudgeMeReview[]
  rating: JudgeMeRating
  currentPage: number
  totalPages: number
}

function extractNumericId(gid: string): string {
  // Handles Shopify GIDs like "gid://shopify/Product/8891627708706"
  // and plain numeric strings
  return gid.split("/").pop() ?? gid
}

export async function fetchProductReviews(
  productGid: string,
  page = 1,
  perPage = 10,
): Promise<JudgeMeReviewsData> {
  const empty: JudgeMeReviewsData = {
    reviews: [],
    rating: { average: 0, count: 0 },
    currentPage: 1,
    totalPages: 0,
  }

  if (!PRIVATE_TOKEN) {
    // Return demo review data when Judge.me is not configured
    return {
      reviews: [],
      rating: { average: 4.8, count: 4 },
      currentPage: 1,
      totalPages: 1,
    }
  }

  const productId = extractNumericId(productGid)

  try {
    const url = new URL(`${BASE}/reviews`)
    url.searchParams.set("api_token", PRIVATE_TOKEN)
    url.searchParams.set("shop_domain", SHOP_DOMAIN)
    url.searchParams.set("product_id", productId)
    url.searchParams.set("page", String(page))
    url.searchParams.set("per_page", String(perPage))

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return empty

    const data = await res.json()
    const reviews: JudgeMeReview[] = data.reviews ?? []
    const total: number =
      typeof data.total === "number" ? data.total : reviews.length
    const totalPages: number =
      typeof data.total_pages === "number"
        ? data.total_pages
        : Math.ceil(total / perPage) || 1
    const average: number =
      typeof data.average_rating === "number"
        ? data.average_rating
        : reviews.length > 0
          ? parseFloat(
              (
                reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
              ).toFixed(1),
            )
          : 0

    return {
      reviews,
      rating: { average, count: total },
      currentPage: data.current_page ?? page,
      totalPages,
    }
  } catch {
    return empty
  }
}

// Fetches the Judge.me internal product ID using the Shopify numeric product ID.
// Judge.me uses its own internal IDs for review form URLs, not Shopify IDs.
// Cached for 24 hours since this mapping never changes.
export async function fetchJudgeMeProductId(
  shopifyProductGid: string,
): Promise<number | null> {
  if (!PRIVATE_TOKEN) return null

  const shopifyNumericId = extractNumericId(shopifyProductGid)

  try {
    const url = new URL(`${BASE}/products/-1`)
    url.searchParams.set("api_token", PRIVATE_TOKEN)
    url.searchParams.set("shop_domain", SHOP_DOMAIN)
    url.searchParams.set("external_id", shopifyNumericId)

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
    if (!res.ok) return null

    const data = await res.json()
    return typeof data.product?.id === "number" ? data.product.id : null
  } catch {
    return null
  }
}

// Used on the shop listing page to show star badges on product cards.
export async function fetchAllProductRatings(): Promise<
  Map<string, JudgeMeRating>
> {
  if (!PRIVATE_TOKEN) {
    // Return demo ratings for static products so product cards show stars
    return new Map([
      ["himalayan-bath-salts-lavender", { average: 4.8, count: 24 }],
      ["coconut-body-scrub", { average: 4.9, count: 31 }],
      ["lavender-essential-oil-30ml", { average: 4.7, count: 18 }],
      ["eucalyptus-mint-soy-candle", { average: 4.6, count: 12 }],
    ])
  }

  try {
    const url = new URL(`${BASE}/products`)
    url.searchParams.set("api_token", PRIVATE_TOKEN)
    url.searchParams.set("shop_domain", SHOP_DOMAIN)
    url.searchParams.set("per_page", "100")

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return new Map()

    const data = await res.json()
    const products: Array<{
      handle: string
      average_rating?: number
      review_count?: number
      number_of_reviews?: number
    }> = data.products ?? []

    return new Map(
      products.map((p) => [
        p.handle,
        {
          average: p.average_rating ?? 0,
          count: p.review_count ?? p.number_of_reviews ?? 0,
        },
      ]),
    )
  } catch {
    return new Map()
  }
}
