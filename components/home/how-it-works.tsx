"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { brand } from "@/config/brand"

const STEPS = [
  {
    num: "01",
    title: "Choose Your Style",
    sub: "Indoor. Outdoor. Hanging. Tabletop.",
    desc: "Indoor pots for living rooms and offices, outdoor planters for patios and gardens, hanging pots for balconies, or tabletop for desks and windowsills. Pick what fits your space.",
  },
  {
    num: "02",
    title: "Select Size & Color",
    sub: "Mix. Match. Arrange.",
    desc: "Each planter comes in multiple sizes and neutral tones — White, Charcoal, Grey, Natural. Mix and match to create your perfect arrangement.",
  },
  {
    num: "03",
    title: "Plant & Enjoy",
    sub: "Built to last.",
    desc: "Your planter arrives in 7 days. UV-protected finish means colours stay vibrant. Weather-resistant means no cracks or fading. Just add your favourite plant and enjoy.",
  },
]

export function HowItWorks() {
  const ref = useScrollAnimation()

  return (
    <section ref={ref} className="relative bg-secondary">
      <div className="grid lg:grid-cols-[1fr_1.2fr]">
        {/* Sticky image */}
        <div className="hidden lg:block lg:sticky lg:top-0 lg:self-start lg:min-h-[600px] overflow-hidden">
          <div className="relative h-full lg:min-h-[600px]">
            <Image
              src="/images/hero/homepage-hero.jpg"
              alt={`${brand.name} premium fiber planters`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-secondary" />
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col justify-center bg-background lg:bg-secondary px-6 py-20 md:px-12 lg:px-20 lg:py-28">
          <p className="animate-on-scroll font-sans text-sm tracking-[0.4em] uppercase text-primary">
            How It Works
          </p>
          <h2 className="animate-on-scroll delay-1 mt-6 font-serif text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
            Ridiculously simple.
          </h2>

          <div className="mt-16 flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`animate-on-scroll delay-${i + 2}`}>
                <div className="flex items-start gap-6">
                  <span className="font-serif text-5xl text-primary/20 lg:text-6xl">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-foreground md:text-2xl lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm tracking-wide text-primary">
                      {step.sub}
                    </p>
                    <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground lg:text-lg">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="ml-6 mt-8 h-px w-16 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
