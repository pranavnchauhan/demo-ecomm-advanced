"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { Product } from "@/lib/shopify/types"

const PLACEHOLDER_PRODUCTS = [
  { name: "Apple Shape Pot", accent: "Indoor Classic", image: "/images/collections/indoor-pots.jpg" },
  { name: "Tall Square Planter", accent: "Outdoor Ready", image: "/images/collections/outdoor-planters.jpg" },
  { name: "Hanging Macrame Pot", accent: "Space Saver", image: "/images/collections/hanging-pots.jpg" },
  { name: "Low Wide Bowl", accent: "Tabletop Perfect", image: "/images/collections/tabletop.jpg" },
]

export function FeaturedProducts({ products }: { products: Product[] }) {
  const ref = useScrollAnimation()
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.6
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-background">
      {/* Section header */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary">
              The Range
            </p>
            <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl text-balance">
              Our bestsellers.
            </h2>
            <p className="animate-on-scroll delay-2 mt-4 text-base text-muted-foreground max-w-2xl">
              Premium fiber planters for indoor and outdoor living. Lightweight, weather-resistant, and designed in Australia.
            </p>
          </div>
          <div className="animate-on-scroll delay-2 hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll product cards */}
      <div
        ref={scrollRef}
        className="horizontal-scroll mt-12 flex gap-5 overflow-x-auto px-6 pr-6 md:px-12 md:pr-12 lg:px-20 lg:pr-20 pb-4"
      >
        {products.length > 0
          ? products.map((product, i) => (
              <div key={product.id} className="w-[300px] flex-shrink-0 md:w-[340px] lg:w-[380px]">
                <ProductCard product={product} priority={i < 4} />
              </div>
            ))
          : PLACEHOLDER_PRODUCTS.map((p, i) => (
              <Link
                key={p.name}
                href="/shop"
                className={`animate-on-scroll delay-${i + 1} group relative w-[300px] flex-shrink-0 md:w-[340px] lg:w-[380px]`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <Image
                    src={p.image}
                    alt={`Terra Bloom ${p.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="380px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="font-sans text-xs tracking-[0.2em] uppercase text-gold-light">
                      {p.accent}
                    </span>
                    <h3 className="mt-2 font-serif text-3xl text-white">{p.name}</h3>
                  </div>
                </div>
              </Link>
            ))}

        {/* Browse all card */}
        <Link
          href="/shop"
          className="group flex w-[300px] flex-shrink-0 items-center justify-center border border-border bg-secondary md:w-[340px] lg:w-[380px] aspect-[3/4] transition-colors hover:border-primary"
        >
          <div className="flex flex-col items-center gap-4 text-muted-foreground transition-colors group-hover:text-primary">
            <ArrowRight className="h-8 w-8" />
            <span className="font-sans text-sm tracking-[0.2em] uppercase">
              View All
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
