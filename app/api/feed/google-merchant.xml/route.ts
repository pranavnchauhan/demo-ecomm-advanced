import { getProductsForFeed, type FeedProduct } from "@/lib/shopify"
import { COMING_SOON_HANDLES } from "@/lib/constants"

export const revalidate = 3600

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function getWeightKg(p: FeedProduct): number {
  const v = p.variants[0]
  if (v?.weight != null) {
    switch (v.weightUnit) {
      case "KILOGRAMS": return v.weight
      case "GRAMS":     return v.weight / 1000
      case "POUNDS":    return v.weight * 0.453592
      case "OUNCES":    return v.weight * 0.0283495
      default:          return v.weight
    }
  }
  // Fallback by product size when Shopify weight is unavailable
  return p.handle.includes("100ml") ? 0.25 : 0.12
}

export async function GET() {
  const products = await getProductsForFeed()

  const items = products
    .filter((p) => !COMING_SOON_HANDLES.has(p.handle))
    .map((p) => {
      const totalQty = p.variants.reduce(
        (sum, v) => sum + (v.quantityAvailable ?? 0),
        0,
      )
      const availability = totalQty > 0 ? "in stock" : "out of stock"
      const price = `${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)} ${p.priceRange.minVariantPrice.currencyCode}`
      const imageUrl = p.images.edges[0]?.node.url ?? ""
      const weightKg = getWeightKg(p).toFixed(2)

      const numericId = p.id.split("/").pop() ?? p.id

      return `
    <item>
      <g:id>${numericId}</g:id>
      <g:title>${escapeXml(p.title)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(`https://www.saltandstone.com.au/shop/${p.handle}`)}</g:link>
      <g:price>${escapeXml(price)}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Salt &amp; Stone AU</g:brand>
      <g:mpn>${numericId}</g:mpn>
      <g:google_product_category>5765</g:google_product_category>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:shipping_weight>${weightKg} kg</g:shipping_weight>
      <g:identifier_exists>FALSE</g:identifier_exists>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Salt &amp; Stone AU</title>
    <link>https://www.saltandstone.com.au</link>
    <description>Salt &amp; Stone AU Natural Body Care Product Feed</description>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
