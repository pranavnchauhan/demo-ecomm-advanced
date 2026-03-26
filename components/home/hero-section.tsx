"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { brand } from "@/config/brand"

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % brand.hero.rollingText.length)
    }, 2200)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  const pair = brand.hero.rollingText[wordIndex]

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/homepage-hero.jpg"
          alt={`${brand.name} natural body care product range`}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div
            className={`transition-all duration-700 delay-300 ${
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="font-sans text-sm tracking-[0.4em] uppercase text-primary md:text-base">
              Natural Body Care & Home Essentials
            </span>
          </div>

          {/* Main heading -- two single lines, auto-scaled */}
          <h1
            className={`mt-6 font-serif text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-1000 delay-500 ${
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Line 1: Drop the [rolling] */}
            <span className="text-foreground">Drop the{" "}</span>
            <span className="relative inline-block">
              <span className="invisible">{pair.drop}</span>
              <span
                key={`drop-${wordIndex}`}
                className="absolute left-0 top-0 text-primary whitespace-nowrap"
                style={{
                  animation: "wordIn 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                }}
              >
                {pair.drop}
              </span>
            </span>
            <br />
            {/* Line 2: Keep the [rolling] */}
            <span className="text-foreground">Keep the{" "}</span>
            <span className="relative inline-block">
              <span className="invisible">{pair.keep}</span>
              <span
                key={`keep-${wordIndex}`}
                className="absolute left-0 top-0 text-primary whitespace-nowrap"
                style={{
                  animation: "wordIn 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                }}
              >
                {pair.keep}
              </span>
            </span>
          </h1>

          {/* Subline */}
          <p
            className={`mt-8 max-w-lg text-xl leading-relaxed text-muted-foreground md:text-2xl transition-all duration-700 delay-700 ${
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {brand.hero.subtitle}
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-[900ms] ${
              ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href={brand.hero.ctaPrimary.href}
              className="group inline-flex items-center justify-center gap-3 bg-primary px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase text-primary-foreground transition-all hover:bg-primary/85"
            >
              {brand.hero.ctaPrimary.text}
              <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href={brand.hero.ctaSecondary.href}
              className="inline-flex items-center justify-center border border-foreground/20 px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase text-foreground transition-all hover:border-primary hover:text-primary"
            >
              {brand.hero.ctaSecondary.text}
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 delay-[1100ms] ${
            ready ? "opacity-60" : "opacity-0"
          }`}
        >
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
