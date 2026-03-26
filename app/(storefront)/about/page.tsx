import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Leaf, Heart, Sparkles, ArrowRight, Droplets } from "lucide-react"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Our Story | ${brand.name}`,
  description: `${brand.name} is an Australian natural body care brand. Handcrafted bath salts, body scrubs, essential oils, and soy candles. ${brand.tagline}`,
  alternates: {
    canonical: `https://www.${brand.domain}/about`,
  },
}

export default function AboutPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Our Story</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl text-balance">
            {brand.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {brand.name} began on the coast of New South Wales, where salt air, native botanicals, and
            a slower pace of life inspired us to create body care that honours the natural world. Every
            product is handcrafted in small batches using pure, sustainably sourced ingredients &mdash;
            no parabens, no sulphates, no synthetic fragrances. Just honest, nature-driven care for
            your body and home.
          </p>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="border-b border-border px-6 py-16 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-4xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">Our Philosophy</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
              Pure ingredients. Gentle rituals.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              The body care industry is full of products that promise natural but deliver chemicals &mdash;
              synthetic fragrances to mask harsh formulations, parabens to extend shelf life, and
              microplastics hidden in exfoliants.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We started {brand.name} because we believed Australians deserve better. Every product
              we make shares one principle: real ingredients you can recognise and trust. Whether
              it&apos;s mineral-rich bath salts for your evening soak, a sugar scrub that leaves
              your skin glowing, essential oils for your diffuser, or a hand-poured soy candle
              for your living room &mdash; what&apos;s on the label is what&apos;s in the product.
              Nothing more.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Every product is Australian made, cruelty free, and packaged in recyclable or
              compostable materials. We believe sustainability isn&apos;t a trend &mdash;
              it&apos;s a responsibility.
            </p>
          </div>
          <div className="relative min-h-[500px] overflow-hidden bg-[#e8dcc8]">
            <Image
              src="/images/about-workshop.jpg"
              alt="Natural body care ingredients — the foundation of Salt & Stone AU products"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Our Range */}
      <section className="border-b border-border bg-secondary px-6 py-16 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">Our Range</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
            Five collections. One standard.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 p-6 border border-border bg-background">
              <Droplets className="h-6 w-6 text-primary" />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Bath Salts</h3>
              <p className="text-xs font-mono tracking-wider text-primary">&ldquo;Drop The Chemicals. Keep The Clean.&rdquo;</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mineral-rich bath salts handcrafted with Himalayan pink salt, dead sea salt, and pure
                essential oils. Soak away the day, naturally.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-6 border border-border bg-background">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Body Scrubs</h3>
              <p className="text-xs font-mono tracking-wider text-primary">&ldquo;Drop The Synthetic. Keep The Natural.&rdquo;</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Exfoliating body scrubs made with raw sugar, coconut oil, and botanical extracts.
                Smooth skin without the nasties.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-6 border border-border bg-background">
              <Leaf className="h-6 w-6 text-primary" />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Essential Oils</h3>
              <p className="text-xs font-mono tracking-wider text-primary">&ldquo;Drop The Harsh. Keep The Gentle.&rdquo;</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Therapeutic-grade essential oil blends sourced from Australian and global botanicals.
                For diffusing, bathing, and everyday wellness.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-6 border border-border bg-background">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Soy Candles</h3>
              <p className="text-xs font-mono tracking-wider text-primary">&ldquo;Drop The Artificial. Keep The Pure.&rdquo;</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hand-poured soy wax candles with cotton wicks and essential oil fragrances.
                Clean burn, no toxins, beautiful scent throw.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-6 border border-border bg-background md:col-span-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Hand Wash</h3>
              <p className="text-xs font-mono tracking-wider text-primary">&ldquo;Drop The Irritants. Keep The Care.&rdquo;</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gentle foaming hand wash with plant-derived cleansers and moisturising botanicals.
                Kind to sensitive skin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Certification Cards */}
      <section className="border-b border-border bg-secondary px-6 py-16 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">What We Stand For</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
            Our values.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 - 100% Natural */}
            <div className="flex items-center justify-between gap-4 p-6 bg-[#d9d4cc]">
              <div className="flex-1">
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">100% Natural</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Every ingredient is sourced from nature. No parabens, no sulphates, no synthetic
                  fragrances, no artificial colours. We use only plant-based and mineral ingredients
                  you can trust.
                </p>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/30">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>
            {/* Card 2 - Cruelty Free */}
            <div className="flex items-center justify-between gap-4 p-6 bg-[#d9d4cc]">
              <div className="flex-1">
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Cruelty Free & Vegan</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Never tested on animals. All products are 100% vegan with no animal-derived
                  ingredients. Kind to your skin and kind to the planet.
                </p>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/30">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>
            {/* Card 3 - Australian Made & Owned */}
            <div className="flex items-center justify-between gap-4 p-6 bg-[#d9d4cc]">
              <div className="flex-1">
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Australian Made & Owned</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Handcrafted in small batches on the NSW coast. Australian owned and operated,
                  supporting local suppliers and communities.
                </p>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/30">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            {/* Card 4 - Eco-Friendly */}
            <div className="flex items-center justify-between gap-4 p-6 bg-[#d9d4cc]">
              <div className="flex-1">
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">Eco-Friendly Packaging</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  All packaging is recyclable, compostable, or reusable. We use glass jars, kraft
                  paper, and soy-based inks. No single-use plastics.
                </p>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/30">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop the Range - Category Tiles */}
      <section className="px-6 py-16 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
            Shop The Range
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
            Find what&apos;s right for you.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Pure, natural ingredients across five collections. Zero compromises across all of them.
          </p>

          <p className="mt-6 text-base text-muted-foreground">
            Not sure where to start?{" "}
            <Link href="/shop" className="text-primary hover:underline">Browse the full range</Link>{" "}
            or{" "}
            <Link href="/contact" className="text-primary hover:underline">get in touch</Link> for personalised recommendations.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left items-stretch">
            {/* Tile 1 - Bath Salts */}
            <Link
              href="/collections/bath-salts"
              className="group flex flex-col overflow-hidden border border-border bg-secondary hover:border-primary transition-colors"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                  src="/images/collections/bath-salts.jpg"
                  alt="Bath Salts collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary h-8">Himalayan · Dead Sea · Essential Oils</p>
                <h3 className="font-serif text-2xl text-foreground">Bath Salts</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">
                  Drop The Chemicals. Keep The Clean.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>

            {/* Tile 2 - Body Scrubs */}
            <Link
              href="/collections/body-scrubs"
              className="group flex flex-col overflow-hidden border border-border bg-secondary hover:border-primary transition-colors"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                  src="/images/collections/body-scrubs.jpg"
                  alt="Body Scrubs collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary h-8">Sugar · Coconut Oil · Botanicals</p>
                <h3 className="font-serif text-2xl text-foreground">Body Scrubs</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">
                  Drop The Synthetic. Keep The Natural.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>

            {/* Tile 3 - Soy Candles */}
            <Link
              href="/collections/candles"
              className="group flex flex-col overflow-hidden border border-border bg-secondary hover:border-primary transition-colors"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                  src="/images/collections/candles.jpg"
                  alt="Soy Candles collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary h-8">Soy Wax · Cotton Wick · Essential Oils</p>
                <h3 className="font-serif text-2xl text-foreground">Soy Candles</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">
                  Drop The Artificial. Keep The Pure.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
