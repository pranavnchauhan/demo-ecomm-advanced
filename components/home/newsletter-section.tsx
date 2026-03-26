"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function NewsletterSection() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center lg:py-28">
        <p className="animate-on-scroll font-mono text-xs tracking-[0.4em] uppercase text-primary">
          WELCOME OFFER
        </p>
        <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-4xl tracking-tight text-card-foreground md:text-5xl lg:text-6xl">
          10% off your first order.
        </h2>
        <p className="animate-on-scroll delay-2 mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          No sign-up required. Just add to cart and use code at checkout.
        </p>

        <div className="animate-on-scroll delay-3 mt-8 inline-block border border-primary px-8 py-4">
          <span className="font-mono text-xl tracking-[0.4em] text-primary">WELCOME2PU</span>
        </div>

        <Link
          href="/shop"
          className="animate-on-scroll delay-4 group mt-8 inline-flex items-center gap-2 bg-primary px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase text-primary-foreground transition-colors hover:bg-primary/85"
        >
          Shop Now
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
