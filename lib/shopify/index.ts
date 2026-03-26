import {
  ProductCollectionSortKey,
  ProductSortKey,
  ShopifyCart,
  ShopifyCollection,
  ShopifyProduct,
} from './types'

import { parseShopifyDomain } from './parse-shopify-domain'

// Sanitize text to remove em dashes and en dashes from Shopify content
function sanitizeText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/—/g, ': ')   // em dash to colon
    .replace(/–/g, ' to ') // en dash to "to" for ranges
    .replace(/ +/g, ' ')   // collapse multiple spaces
    .trim()
}

// ── Domain ──────────────────────────────────────────────────────────
const rawStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_STORE_DOMAIN = rawStoreDomain
  ? parseShopifyDomain(rawStoreDomain)
  : 'v0-template.myshopify.com'

// ── Credentials (custom app via Settings > Apps > Develop apps) ─────
const CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID || ''
const CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET || ''

// ── Endpoints ───────────────────────────────────────────────────────
const API_VERSION = '2025-07'
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`
const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`
const OAUTH_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`

// ── Token cache ─────────────────────────────────────────────────────
let adminToken: { value: string; expiresAt: number } | null = null
let storefrontToken: string | null = null

// ── Get Admin Token via OAuth client_credentials ────────────────────
// Uses application/x-www-form-urlencoded (proven working in push-images script)
export async function getAdminToken(): Promise<string | null> {
  if (adminToken && Date.now() < adminToken.expiresAt - 60_000) {
    return adminToken.value
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log('[shopify] Missing SHOPIFY_ADMIN_CLIENT_ID or CLIENT_SECRET')
    return null
  }

  try {
    const res = await fetch(OAUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.log('[shopify] OAuth failed:', res.status, body)
      return null
    }

    const json = await res.json()
    if (!json.access_token) {
      console.log('[shopify] No access_token in OAuth response')
      return null
    }

    adminToken = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in || 86399) * 1000,
    }
    return adminToken.value
  } catch (err) {
    console.log('[shopify] OAuth error:', err)
    return null
  }
}

// ── Get / create Storefront Token ───────────────────────────────────
export async function getStorefrontToken(): Promise<string | null> {
  // 1. In-memory cache
  if (storefrontToken) return storefrontToken

  // 2. Check env var (set this in Vercel to avoid Admin API calls on every cold start)
  if (process.env.SHOPIFY_STOREFRONT_TOKEN) {
    storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN
    return storefrontToken
  }

  // 3. Create one via Admin API and log it so it can be added to Vercel env vars
  const token = await getAdminToken()
  if (!token) {
    console.log('[shopify] getStorefrontToken: no admin token available, aborting')
    return null
  }

  try {
    const createRes = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `mutation {
          storefrontAccessTokenCreate(input: { title: "Salt & Stone Headless" }) {
            storefrontAccessToken { accessToken title }
            userErrors { field message }
          }
        }`,
      }),
    })

    if (!createRes.ok) {
      console.log('[shopify] storefrontAccessTokenCreate HTTP error:', createRes.status)
      return null
    }

    const createJson = await createRes.json()
    const userErrors = createJson.data?.storefrontAccessTokenCreate?.userErrors
    if (userErrors?.length > 0) {
      console.log('[shopify] storefrontAccessTokenCreate userErrors:', JSON.stringify(userErrors))
    }

    const newToken = createJson.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken
    if (!newToken) {
      console.log('[shopify] storefrontAccessTokenCreate: no accessToken in response')
      return null
    }

    storefrontToken = newToken
    console.log('[shopify] CREATED STOREFRONT TOKEN - ADD TO VERCEL ENV:', newToken)
    return storefrontToken
  } catch (err) {
    console.log('[shopify] storefrontAccessTokenCreate exception:', err)
    return null
  }
}

// ── Storefront GraphQL fetch ────────────────────────────────────────
async function shopifyFetch<T = any>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const sfToken = await getStorefrontToken()
  if (!sfToken) {
    console.log('[shopify] No storefront token, cannot fetch')
    return null
  }

  // Cart operations must never be served from the Next.js Data Cache — a
  // 60-second stale response after a mutation (add/update/remove) causes the
  // checkout page to show pre-mutation quantities.  Detect cart operations by
  // checking for the word "cart" in the query string (covers cartCreate,
  // cartLinesAdd, cartLinesUpdate, cartLinesRemove, and the cart(...) query).
  const isCartOperation = /cart/i.test(query)
  const cacheOption: RequestInit = isCartOperation
    ? { cache: 'no-store' }
    : { cache: 'no-store' }

  try {
    const res = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': sfToken,
      },
      body: JSON.stringify({ query, variables }),
      ...cacheOption,
    })

    if (!res.ok) {
      console.log('[shopify] Storefront fetch failed:', res.status)
      return null
    }

    const json = await res.json()
    if (json.errors) {
      // Log errors but do NOT return null — GraphQL partial responses are valid.
      // A metafield access-denied error would otherwise wipe out the whole product.
      console.log('[shopify] GraphQL errors (partial response may still be used):', JSON.stringify(json.errors))
    }
    if (!json.data) {
      console.log('[shopify] No data in response')
      return null
    }
    return json as T
  } catch (err) {
    console.log('[shopify] Storefront network error:', err)
    return null
  }
}

// ── Admin GraphQL fetch (for write operations) ──────────────────────
export async function adminFetch<T = any>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const token = await getAdminToken()
  if (!token) return null

  try {
    const res = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!res.ok) return null
    const json = await res.json()
    return json as T
  } catch {
    return null
  }
}

// ── Normalize Shopify product (flatten variants edges, sanitize text) ─────────────
function normalizeProduct(raw: any): ShopifyProduct {
  // Metafields come back as an array of {key, value} | null entries.
  // Convert to a keyed object so consumers don't depend on array position.
  const mfMap: Record<string, string> = {}
  if (Array.isArray(raw.metafields)) {
    console.log(`[shopify] raw metafields for "${raw.handle}":`, JSON.stringify(raw.metafields))
    raw.metafields.filter(Boolean).forEach((mf: { key: string; value: string }) => {
      mfMap[mf.key] = mf.value
    })
  } else {
    console.log(`[shopify] metafields field missing entirely for "${raw.handle}" (query may not include it)`)
  }
  console.log(`[shopify] resolved metafield map for "${raw.handle}":`, mfMap)

  return {
    ...raw,
    title: sanitizeText(raw.title),
    description: sanitizeText(raw.description),
    descriptionHtml: raw.descriptionHtml?.replace(/—/g, ': ').replace(/–/g, ' to '),
    variants: raw.variants?.edges
      ? raw.variants.edges.map((e: any) => ({
          ...e.node,
          title: sanitizeText(e.node.title),
        }))
      : raw.variants || [],
    metafields: {
      ingredients: mfMap.ingredients ?? null,
      how_to_use: mfMap.how_to_use ?? null,
      allergens: mfMap.allergens ?? null,
      serving_size: mfMap.serving_size ?? null,
    },
  }
}

// ── Public API: Products ────────────────────────────────────────────
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    description
    descriptionHtml
    handle
    availableForSale
    productType
    options { id name values }
    images(first: 10) { edges { node { url altText } } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 30) {
      edges {
        node {
          id title availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "ingredients"},
      {namespace: "custom", key: "how_to_use"},
      {namespace: "custom", key: "allergens"},
      {namespace: "custom", key: "serving_size"}
    ]) {
      key
      value
    }
  }
`

export async function getProducts(opts: {
  first?: number
  sortKey?: ProductSortKey
  reverse?: boolean
} = {}): Promise<ShopifyProduct[]> {
  const { first = 12, sortKey = 'RELEVANCE', reverse = false } = opts
  const result = await shopifyFetch<any>(
    `query ($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ...ProductFields } }
      }
    }
    ${PRODUCT_FRAGMENT}`,
    { first, sortKey, reverse },
  )

  if (!result) {
    // Fallback to static demo products when Shopify is unavailable
    const { getStaticProducts } = await import('@/lib/product-data')
    return getStaticProducts().slice(0, first)
  }
  return result.data.products.edges.map((e: any) => normalizeProduct(e.node))
}

export type FeedProduct = {
  id: string
  title: string
  description: string
  handle: string
  images: { edges: Array<{ node: { url: string } }> }
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  variants: Array<{ quantityAvailable: number | null; weight: number | null; weightUnit: string | null }>
}

export async function getProductsForFeed(first = 250): Promise<FeedProduct[]> {
  const result = await shopifyFetch<any>(
    `query ($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id title description handle
            images(first: 1) { edges { node { url } } }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 30) {
              edges { node { quantityAvailable weight weightUnit } }
            }
          }
        }
      }
    }`,
    { first },
  )
  if (!result) return []
  return result.data.products.edges.map((e: any) => ({
    ...e.node,
    variants: e.node.variants.edges.map((v: any) => v.node),
  }))
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const result = await shopifyFetch<any>(
    `query ($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
    ${PRODUCT_FRAGMENT}`,
    { handle },
  )

  if (!result || !result.data.product) {
    // Fallback to static demo product when Shopify is unavailable
    const { getStaticProduct } = await import('@/lib/product-data')
    return getStaticProduct(handle)
  }
  return normalizeProduct(result.data.product)
}

// ── Public API: Collections ─────────────────────────────────────────
export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const result = await shopifyFetch<any>(
    `query ($first: Int!) {
      collections(first: $first) {
        edges { node { id title handle description image { url altText } } }
      }
    }`,
    { first },
  )
  if (!result) return []
  return result.data.collections.edges.map((e: any) => e.node)
}

export async function getCollectionProducts(
  handle: string,
  opts: { first?: number; sortKey?: ProductCollectionSortKey; reverse?: boolean } = {},
): Promise<ShopifyProduct[]> {
  const { first = 12, sortKey = 'BEST_SELLING', reverse = false } = opts
  const result = await shopifyFetch<any>(
    `query ($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          edges { node { ...ProductFields } }
        }
      }
    }
    ${PRODUCT_FRAGMENT}`,
    { handle, first, sortKey, reverse },
  )
  if (!result || !result.data.collection) return []
  return result.data.collection.products.edges.map((e: any) => normalizeProduct(e.node))
}

// ── Public API: Cart ────────────────────────────────────────────────
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              image { url altText }
              selectedOptions { name value }
              product { title handle images(first: 1) { edges { node { url altText } } } }
            }
          }
        }
      }
    }
  }
`

export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart | null> {
  const result = await shopifyFetch<any>(
    `mutation ($variantId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { variantId, quantity },
  )
  return result?.data?.cartCreate?.cart ?? null
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const result = await shopifyFetch<any>(
    `query ($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
    ${CART_FRAGMENT}`,
    { cartId },
  )
  return result?.data?.cart ?? null
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart | null> {
  const result = await shopifyFetch<any>(
    `mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  )
  return result?.data?.cartLinesAdd?.cart ?? null
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const result = await shopifyFetch<any>(
    `mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lines: [{ id: lineId, quantity }] },
  )
  return result?.data?.cartLinesUpdate?.cart ?? null
}

export async function removeCartItem(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  const result = await shopifyFetch<any>(
    `mutation ($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lineIds: [lineId] },
  )
  return result?.data?.cartLinesRemove?.cart ?? null
}
