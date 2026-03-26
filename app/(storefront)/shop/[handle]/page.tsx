import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const revalidate = 0
import Link from "next/link"
import { getProduct, getProducts } from "@/lib/shopify"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductCard } from "@/components/products/product-card"
import { ProductReviews } from "@/components/products/product-reviews"
import { fetchProductReviews, fetchAllProductRatings } from "@/lib/judgeme"
import { brand } from "@/config/brand"
import { getStaticProduct, getStaticProducts } from "@/lib/product-data"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ reviewPage?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = (await getProduct(handle)) ?? getStaticProduct(handle)

  if (!product) {
    return { title: "Product Not Found" }
  }

  const image = product.images.edges[0]?.node

  return {
    title: `${product.title} | ${brand.name}`,
    description: product.description?.slice(0, 160) || `${product.title} — handcrafted natural body care by ${brand.name}. Australian made, cruelty free, eco-friendly.`,
    alternates: {
      canonical: `https://www.${brand.domain}/shop/${handle}`,
    },
    openGraph: {
      title: `${product.title} | ${brand.name}`,
      description: product.description?.slice(0, 160) || `${product.title} — natural body care by ${brand.name}.`,
      images: image ? [{ url: image.url, alt: image.altText || product.title }] : [],
    },
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params
  const { reviewPage: reviewPageParam } = await searchParams
  const reviewPage = Math.max(1, parseInt(reviewPageParam ?? "1", 10) || 1)

  const product = (await getProduct(handle)) ?? getStaticProduct(handle)

  if (!product) {
    notFound()
  }

  // Fetch all data in parallel
  const [shopifyProducts, reviewsData, ratingsMap] = await Promise.all([
    getProducts({ first: 10 }),
    fetchProductReviews(product.id, reviewPage),
    fetchAllProductRatings(),
  ])

  // Fall back to static products for related grid
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : getStaticProducts()

  // Get related products (exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.handle !== handle)
    .slice(0, 3)

  const productImageUrl = product.images.edges[0]?.node.url
  const { rating } = reviewsData

  // Product JSON-LD schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description?.slice(0, 300) || `${product.title} by ${brand.name}`,
    "brand": { "@type": "Brand", "name": brand.name },
    ...(productImageUrl ? { image: productImageUrl } : {}),
    "offers": {
      "@type": "Offer",
      "price": product.priceRange.minVariantPrice.amount,
      "priceCurrency": product.priceRange.minVariantPrice.currencyCode,
      "availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://www.${brand.domain}/shop/${handle}`,
    },
    ...(rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            "@id": `https://www.${brand.domain}/shop/${handle}#aggregateRating`,
            ratingValue: rating.average.toFixed(1),
            reviewCount: rating.count,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.${brand.domain}/` },
              { "@type": "ListItem", "position": 2, "name": "Shop", "item": `https://www.${brand.domain}/shop` },
              { "@type": "ListItem", "position": 3, "name": product.title },
            ],
          }),
        }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Product layout - stack on mobile, side by side on desktop */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Gallery */}
        <ProductGallery product={product} />

        {/* Right: Info + Reviews */}
        <div>
          <ProductInfo product={product} allProducts={allProducts} />
          <ProductReviews
            productId={product.id}
            handle={handle}
            currentPage={reviewPage}
          />
        </div>
      </div>

      {/* You may also like */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-8">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              More to Explore
            </p>
            <h2 className="mt-2 font-serif text-2xl tracking-wide text-foreground md:text-3xl">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                rating={ratingsMap.get(p.handle)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
