"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const PROFILE_INFO: Record<string, { title: string; product: string; productUrl: string; description: string; tips: string[] }> = {
  bath_lover: {
    title: "The Bath Ritual Lover",
    product: "Himalayan Bath Salts",
    productUrl: "/collections/bath-salts",
    description:
      "You live for a long, luxurious soak. Our Himalayan Bath Salts are loaded with minerals that relax muscles, soften skin, and calm the mind. Your perfect evening ritual.",
    tips: [
      "Add 2 to 4 tablespoons to warm running water",
      "Soak for 15 to 20 minutes for maximum benefit",
      "Add a few drops of essential oil for extra relaxation",
      "Moisturise after your bath while skin is still damp",
    ],
  },
  scrub_fan: {
    title: "The Glow Getter",
    product: "Coconut Body Scrub",
    productUrl: "/collections/body-scrubs",
    description:
      "You want smooth, radiant skin without the chemicals. Our body scrubs use raw sugar and coconut oil to exfoliate and nourish, leaving your skin impossibly soft.",
    tips: [
      "Use on damp skin in circular motions",
      "Focus on rough areas like elbows, knees, and heels",
      "Use 2 to 3 times per week for best results",
      "Rinse off and follow with your favourite moisturiser",
    ],
  },
  candle_enthusiast: {
    title: "The Ambience Creator",
    product: "Essential Oil Soy Candle",
    productUrl: "/collections/candles",
    description:
      "You know that the right scent transforms a space. Our hand-poured soy candles fill your home with clean, natural fragrance — no toxins, just pure essential oils.",
    tips: [
      "Trim the wick to 5mm before each burn",
      "Burn for at least 2 hours to prevent tunnelling",
      "Place in your bedroom, bathroom, or living room",
      "Never leave a burning candle unattended",
    ],
  },
  essential_oil_lover: {
    title: "The Wellness Seeker",
    product: "Essential Oil Blends",
    productUrl: "/collections/essential-oils",
    description:
      "You believe in the power of plants. Our therapeutic-grade essential oil blends are perfect for diffusing, adding to baths, or creating your own natural body care.",
    tips: [
      "Add 3 to 5 drops to your diffuser",
      "Mix with a carrier oil for massage",
      "Add to bath salts for a spa-like experience",
      "Keep oils sealed and away from direct sunlight",
    ],
  },
  gift_giver: {
    title: "The Thoughtful Gifter",
    product: "Our Full Range",
    productUrl: "/shop",
    description:
      "You want to give something meaningful. Our natural body care products make beautiful, thoughtful gifts — handcrafted in Australia with pure ingredients and eco-friendly packaging.",
    tips: [
      "Bath salts and body scrubs are universally loved",
      "Soy candles make a perfect housewarming gift",
      "Essential oils are great for the wellness-minded",
      "All products come in beautiful, gift-ready packaging",
    ],
  },
}

export function QuizResults({
  profileType,
}: {
  profileType: string
  recommendations: string[]
}) {
  const info = PROFILE_INFO[profileType] || PROFILE_INFO.bath_lover

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">
        Your Ritual Match
      </p>
      <h2 className="mt-4 font-serif text-4xl tracking-wide text-foreground md:text-5xl">
        {info.title}
      </h2>
      <p className="mt-2 font-serif text-lg text-accent">
        {"We recommend: "}
        <strong>{info.product}</strong>
      </p>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
        {info.description}
      </p>

      {/* Tips */}
      <div className="mt-10 w-full max-w-lg">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Your Self-Care Tips
        </h3>
        <ul className="mt-4 flex flex-col gap-3">
          {info.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-left">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              <span className="text-sm leading-relaxed text-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href={info.productUrl}
          className="group inline-flex items-center justify-center gap-2 bg-foreground px-8 py-4 text-sm uppercase tracking-widest text-primary-foreground transition-all hover:bg-foreground/90"
        >
          Shop {info.product.split(" (")[0]}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center border border-border px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:border-foreground"
        >
          View All Products
        </Link>
      </div>
    </div>
  )
}
