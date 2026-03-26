import type { Metadata } from "next"
import Link from "next/link"
import { getProducts, getCollections } from "@/lib/shopify"
import { fetchAllProductRatings } from "@/lib/judgeme"
import { brand } from "@/config/brand"
import { getStaticProducts } from "@/lib/product-data"
import { ShopPageWrapper } from "@/components/shop/shop-page-wrapper"

export const metadata: Metadata = {
  title: `Shop Products | ${brand.name}`,
  description: `Browse the full ${brand.name} range. Australian made. Free AU shipping over $${brand.shipping.freeThresholdDomestic}.`,
  alternates: {
    canonical: `https://www.${brand.domain}/shop`,
  },
}

export default async function ShopPage() {
  const [shopifyProducts, collections, ratingsMap] = await Promise.all([
    getProducts({ first: 50 }),
    getCollections(20),
    fetchAllProductRatings(),
  ])

  const products = shopifyProducts.length > 0 ? shopifyProducts : getStaticProducts()

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shop</span>
        </nav>
        <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl text-balance">
          All Products
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
          Discover our complete collection of premium products.
        </p>
      </div>

      {/* Shop with sidebar filters */}
      <ShopPageWrapper
        products={products}
        collections={collections}
        ratingsMap={ratingsMap}
      />
    </div>
  )
}
