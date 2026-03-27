import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/shopify/types"

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Premium fiber planters for indoor and outdoor living. Lightweight, weather-resistant, and designed in Australia.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => {
            const image = product.images.edges[0]?.node
            const price = parseFloat(product.priceRange.minVariantPrice.amount)
            const compareAt = product.compareAtPriceRange?.minVariantPrice
              ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
              : null
            const isOnSale = compareAt !== null && compareAt > price
            const colorOption = product.options.find((o) => o.name === "Color")

            return (
              <Link key={product.id} href={`/shop/${product.handle}`} className="group">
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-cover product-image-hover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {isOnSale && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {Math.round(((compareAt! - price) / compareAt!) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Category + Material tags */}
                <div className="flex items-center gap-2 mb-1.5">
                  {product.productType && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-green-200 text-green-700 bg-green-50">
                      {product.productType}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-green-700 transition-colors">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isOnSale ? "text-red-600" : "text-gray-900"}`}>
                      ${price.toFixed(0)}
                    </span>
                    {isOnSale && compareAt && (
                      <span className="text-xs text-gray-400 line-through">${compareAt.toFixed(0)}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-green-600 font-medium">7-day delivery</span>
                </div>

                {/* Color swatches */}
                {colorOption && (
                  <div className="flex gap-1.5 mt-2">
                    {colorOption.values.slice(0, 4).map((color) => (
                      <span
                        key={color}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: getSwatchColor(color) }}
                        title={color}
                      />
                    ))}
                    {colorOption.values.length > 4 && (
                      <span className="text-xs text-gray-400">+{colorOption.values.length - 4}</span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-500 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

function getSwatchColor(name: string): string {
  const map: Record<string, string> = {
    white: "#ffffff", charcoal: "#374151", grey: "#9ca3af", natural: "#d4c5a9",
    black: "#111111", sage: "#9caf88", sandstone: "#c2b280", terracotta: "#c67d4b",
  }
  return map[name.toLowerCase()] || "#d1d5db"
}
