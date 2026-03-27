"use client"

import { Star } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useRef } from "react"

const REVIEWS = [
  {
    name: "Priya S.",
    location: "Sydney",
    text: "The Apple Shape Pot is stunning. So much lighter than ceramic but looks just as premium. My monstera loves it.",
    rating: 5,
  },
  {
    name: "Raj K.",
    location: "Melbourne",
    text: "Ordered 4 outdoor planters for our patio. Survived a Melbourne winter with zero damage. Highly recommend.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    location: "Brisbane",
    text: "The tabletop pots are perfect for my herb garden. Clean design, great quality, and they arrived in 5 days.",
    rating: 5,
  },
  {
    name: "Michael T.",
    location: "Perth",
    text: "We renovated our office courtyard with Terra Bloom large planters. The team couldn't believe they're not stone.",
    rating: 5,
  },
  {
    name: "Anita D.",
    location: "Adelaide",
    text: "Love that these are recyclable. Finally a planter brand that cares about sustainability. Beautiful products too.",
    rating: 5,
  },
]

export function Testimonials() {
  const ref = useScrollAnimation()
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="bg-secondary py-24 lg:py-32">
      <div className="px-6 md:px-12 lg:px-20">
        <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary">
          Proof
        </p>
        <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl text-balance">
          Don't take our word for it.
        </h2>
      </div>

      {/* Horizontal scroll reviews */}
      <div
        ref={scrollRef}
        className="horizontal-scroll mt-12 flex gap-5 overflow-x-auto px-6 pb-4 md:px-12 lg:px-20"
      >
        {REVIEWS.map((r, i) => (
          <div
            key={r.name}
            className={`animate-on-scroll delay-${Math.min(i + 1, 5)} flex w-[320px] flex-shrink-0 flex-col justify-between border border-border bg-card p-8 md:w-[380px]`}
          >
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-5 text-base leading-relaxed text-card-foreground">
                {`"${r.text}"`}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
              <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground font-sans text-xs">
                {r.name[0]}
              </div>
              <div>
                <p className="text-base font-medium text-card-foreground">{r.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{r.location}, AU</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
