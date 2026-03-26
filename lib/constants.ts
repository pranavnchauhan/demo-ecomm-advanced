/**
 * Shipping thresholds (AUD).
 *
 * Values are read from server-side env vars (FREE_SHIPPING_AU / FREE_SHIPPING_INTL).
 * Client components that import these constants will use the fallback defaults
 * because non-NEXT_PUBLIC_ env vars are not bundled into the client. The defaults
 * are intentionally set to match the Vercel env values so display stays consistent.
 */
export const FREE_SHIPPING_AU = parseInt(process.env.FREE_SHIPPING_AU ?? "79", 10)
export const FREE_SHIPPING_INTL = parseInt(process.env.FREE_SHIPPING_INTL ?? "149", 10)

/**
 * Products that are visible on the storefront but not yet purchasable.
 * Remove a handle from this set to enable "Add to Bag" for that product.
 */
export const COMING_SOON_HANDLES = new Set<string>([])
