import type { Metadata } from "next"
import { getProducts } from "@/lib/shopify"

export const metadata: Metadata = {
  title: "Natural Body Care & Home Essentials",
  description: "Handcrafted natural body care and home essentials. Australian made bath salts, body scrubs, essential oils, and soy candles. Free AU shipping over $79.",
  alternates: {
    canonical: "https://www.saltandstone.com.au/",
  },
}
import { HeroSection } from "@/components/home/hero-section"
import { TrustBar } from "@/components/home/trust-bar"
import { BrandStory } from "@/components/home/brand-story"
import { FeaturedProducts } from "@/components/home/featured-products"
import { HowItWorks } from "@/components/home/how-it-works"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { Testimonials } from "@/components/home/testimonials"
import { CtaCombined } from "@/components/home/cta-combined"

// Sort products by best-selling order (Shopify returns them sorted already)
function sortProducts(products: any[]) {
  return products
}

export default async function HomePage() {
  let products: any[] = []
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Shopify timeout")), 8000)
    )
    products = await Promise.race([
      getProducts({ first: 5, sortKey: "BEST_SELLING" }),
      timeout,
    ])
    // Sort products for optimal display order
    products = sortProducts(products)
  } catch {
    products = []
  }

  return (
    <>
      <HeroSection />
      <TrustBar />
      <BrandStory />
      <FeaturedProducts products={products} />
      <HowItWorks />
      <CategoryShowcase />
      <Testimonials />
      <CtaCombined />
    </>
  )
}
