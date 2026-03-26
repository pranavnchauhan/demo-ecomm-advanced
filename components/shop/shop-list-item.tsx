import Link from "next/link"
import Image from "next/image"
import type { ShopifyProduct } from "@/lib/shopify/types"

export function ShopListItem({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node
  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const compareAt = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null
  const isOnSale = compareAt !== null && compareAt > price

  return (
    <Link href={`/shop/${product.handle}`} className="flex gap-4 p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
      <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        {image && (
          <Image src={image.url} alt={image.altText || product.title} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {product.productType && (
          <span className="text-xs text-primary font-medium">{product.productType}</span>
        )}
        <h3 className="font-medium text-sm mt-0.5">{product.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-sm font-semibold ${isOnSale ? "text-destructive" : ""}`}>
            ${price.toFixed(2)}
          </span>
          {isOnSale && compareAt && (
            <span className="text-sm text-muted-foreground line-through">${compareAt.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
