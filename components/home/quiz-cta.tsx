"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function QuizCta() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="relative overflow-hidden bg-background">
      {/* Background product image */}
      <div className="absolute inset-0 opacity-[0.08]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-banner-mx52TzKMPce1q5pzMXKJhm6gQjLzjv.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-28 text-center lg:py-40">
        <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary md:text-base">
          60-Second Quiz
        </p>
        <h2 className="animate-on-scroll delay-1 mt-6 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
          Which drop
          <br />
          <span className="text-primary">are you?</span>
        </h2>
        <p className="animate-on-scroll delay-2 mt-6 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
          Answer a few quick questions and we will match you with the perfect
          flavour for how you actually live.
        </p>
        <Link
          href="/quiz"
          className="animate-on-scroll delay-3 group mt-10 inline-flex items-center gap-3 bg-primary px-12 py-5 font-sans text-sm tracking-[0.2em] uppercase text-primary-foreground transition-all hover:bg-primary/85"
        >
          Take the Quiz
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
