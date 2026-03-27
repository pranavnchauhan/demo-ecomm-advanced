"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { brand } from "@/config/brand"

export function BrandStory() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="relative overflow-hidden bg-background">
      {/* Split screen -- image left, manifesto right */}
      <div className="grid min-h-[60vh] lg:grid-cols-2">
        {/* Image side */}
        <div className="relative min-h-[40vh] lg:min-h-[60vh] overflow-hidden">
          <Image
            src="/images/hero/homepage-hero.jpg"
            alt={`${brand.name} premium planter collection`}
            fill
            className="object-cover parallax-zoom"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
        </div>

        {/* Manifesto side */}
        <div className="flex items-center px-6 py-20 md:px-12 lg:px-20 lg:py-20">
          <div className="max-w-lg">
            <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary">
              Our Manifesto
            </p>

            <h2 className="animate-on-scroll delay-1 mt-6 font-serif text-3xl leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
              Premium material. Timeless design.
            </h2>

            <div className="animate-on-scroll delay-2 mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                For too long, planters have been either fragile ceramic that chips, heavy concrete that cracks, or cheap plastic that fades. We started Terra Bloom to prove there's a better way — premium fiber planters that are lightweight, weather-resistant, UV-protected, and beautiful enough for any space.
              </p>
              <p>
                Every {brand.name} planter starts with one principle: form meets
                function. From compact tabletop pots to statement-making large planters — every piece is crafted from premium fiber material
                right here in Australia.
              </p>
              <p className="text-foreground font-medium">
                No cracking. No fading. No compromise. Just planters built to
                last and designed to impress.
              </p>
            </div>

            <div className="animate-on-scroll delay-3 mt-10 flex gap-12">
              <div>
                <span className="block font-serif text-3xl text-primary md:text-4xl">{brand.collections.length}</span>
                <span className="mt-1 block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Collections
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl text-primary md:text-4xl">UV</span>
                <span className="mt-1 block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Protected
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl text-primary md:text-4xl">100%</span>
                <span className="mt-1 block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Recyclable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
