import { getProductsForFeed } from "@/lib/shopify"
import { COMING_SOON_HANDLES } from "@/lib/constants"

export const revalidate = 3600

export async function GET() {
  const products = await getProductsForFeed()

  const entries = products
    .filter((p) => !COMING_SOON_HANDLES.has(p.handle))
    .map((p) => {
      const numericId = p.id.split("/").pop() ?? p.id
      const totalQty = p.variants.reduce(
        (sum, v) => sum + (v.quantityAvailable ?? 0),
        0,
      )
      const availability = totalQty > 0 ? "in stock" : "out of stock"
      const price = `${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)} ${p.priceRange.minVariantPrice.currencyCode}`

      return `
  <entry>
    <g:id>${numericId}</g:id>
    <g:store_code>online</g:store_code>
    <g:availability>${availability}</g:availability>
    <g:quantity>${totalQty}</g:quantity>
    <g:price>${price}</g:price>
  </entry>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">${entries}
</feed>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
