"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { brand } from "@/config/brand"

export function CategoryShowcase() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="bg-background px-6 py-20 md:px-12 lg:px-20 lg:py-28">
      <div className="flex items-end justify-between">
        <div>
          <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary">
            Our Collections
          </p>
          <h2 className="animate-on-scroll delay-1 mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl text-balance">
            {brand.tagline}
          </h2>
        </div>
        <Link
          href="/shop"
          className="animate-on-scroll delay-2 group hidden items-center gap-2 font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-primary sm:flex"
        >
          Shop All
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {brand.collections.map((c, i) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            className={`animate-on-scroll delay-${i + 1} group`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl text-muted-foreground/30">{c.title}</span>
                </div>
              )}
            </div>
            <div className="pt-3">
              <h3 className="font-serif text-lg text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
