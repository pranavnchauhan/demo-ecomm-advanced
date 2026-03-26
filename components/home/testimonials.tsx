"use client"

import { Star } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useRef } from "react"

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "Sydney",
    text: "The lavender bath salts are incredible. My skin has never felt softer and the scent is divine.",
    rating: 5,
  },
  {
    name: "James K.",
    location: "Melbourne",
    text: "Finally found a body scrub that actually uses natural ingredients. Love it.",
    rating: 5,
  },
  {
    name: "Emily R.",
    location: "Brisbane",
    text: "The soy candles burn beautifully and the scents are divine. Will be ordering more.",
    rating: 5,
  },
  {
    name: "Olivia T.",
    location: "Perth",
    text: "The hand wash smells amazing and doesn't dry out my hands. Switched the whole house over.",
    rating: 5,
  },
  {
    name: "Daniel W.",
    location: "Adelaide",
    text: "Bought the essential oil blend for my diffuser — the quality is next level. So much better than supermarket brands.",
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
