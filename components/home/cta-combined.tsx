"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { brand } from "@/config/brand"

export function CtaCombined() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="relative overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.06]">
        <Image
          src="/images/hero/homepage-hero.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column - Quiz */}
          <div>
            <p className="animate-on-scroll font-mono text-xs tracking-[0.4em] uppercase text-primary">
              60-SECOND QUIZ
            </p>
            <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Find your perfect ritual.
            </h2>
            <p className="animate-on-scroll delay-2 mt-4 text-sm text-muted-foreground">
              Answer a few quick questions and we will match you with the
              right products for your self-care routine.
            </p>
            <Link
              href="/quiz"
              className="animate-on-scroll delay-3 group mt-8 inline-flex items-center gap-2 bg-primary px-10 py-4 font-mono text-xs tracking-[0.3em] uppercase text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Take the Quiz
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column - Welcome Offer */}
          <div className="lg:border-l lg:border-border lg:pl-16">
            <p className="animate-on-scroll font-mono text-xs tracking-[0.4em] uppercase text-primary">
              WELCOME OFFER
            </p>
            <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              10% off your first order.
            </h2>
            <p className="animate-on-scroll delay-2 mt-4 text-sm text-muted-foreground">
              No sign-up required. Just add to cart and use code at checkout.
            </p>
            <div className="animate-on-scroll delay-3 mt-8 inline-block border border-primary px-8 py-4">
              <span className="font-mono text-xl tracking-[0.4em] text-primary">WELCOME10</span>
            </div>
            <div className="animate-on-scroll delay-4 mt-6">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border border-foreground px-10 py-4 font-mono text-xs tracking-[0.3em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Shop Now
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
