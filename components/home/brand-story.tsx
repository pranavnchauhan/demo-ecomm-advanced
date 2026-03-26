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
            alt={`${brand.name} natural body care collection`}
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
              Pure ingredients. Nothing else.
            </h2>

            <div className="animate-on-scroll delay-2 mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                For too long, the body care industry has been filled with
                synthetic fragrances, harsh chemicals, and ingredients you
                cannot pronounce. We decided that was enough.
              </p>
              <p>
                Every {brand.name} product starts with one principle: the purest,
                most natural ingredients possible. From mineral-rich bath salts
                and hand-blended body scrubs to therapeutic essential oils and
                hand-poured soy candles — everything is crafted in small batches
                right here in Australia.
              </p>
              <p className="text-foreground font-medium">
                No parabens. No sulphates. No compromise. Just what your body
                deserves and nothing it does not.
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
                <span className="block font-serif text-3xl text-primary md:text-4xl">0</span>
                <span className="mt-1 block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Harsh chemicals
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl text-primary md:text-4xl">100%</span>
                <span className="mt-1 block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Australian made
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
