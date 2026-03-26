import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight } from "lucide-react"
import { getCollectionProducts } from "@/lib/shopify"
import { ProductCard } from "@/components/products/product-card"
import { fetchAllProductRatings } from "@/lib/judgeme"
import { getCollectionConfig, COLLECTION_CONFIGS } from "@/lib/collection-config"
import { brand } from "@/config/brand"

export const revalidate = 3600

// Generate static paths for all configured collections
export function generateStaticParams() {
  return Object.keys(COLLECTION_CONFIGS).map((handle) => ({ handle }))
}

// Dynamic metadata per collection
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const config = getCollectionConfig(handle)
  if (!config) return { title: "Collection Not Found" }

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://www.${brand.domain}/collections/${handle}`,
    },
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const config = getCollectionConfig(handle)
  if (!config) notFound()

  const products = await getCollectionProducts(handle, { first: 20 })
  const ratingsMap = await fetchAllProductRatings()

  return (
    <main className="bg-background">
      {/* Hero — split layout: text left, image right */}
      <section className={`${config.heroColor}`}>
        <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{config.title}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image — left side */}
            {config.heroImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm order-2 lg:order-1">
                <Image
                  src={config.heroImage}
                  alt={config.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center aspect-[4/3] bg-secondary rounded-sm order-2 lg:order-1">
                <span className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Text — right side */}
            <div className="order-1 lg:order-2">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                {brand.name}
              </p>
              <h1 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {config.title}
              </h1>
              <p className="mt-4 font-serif text-lg text-primary lg:text-xl">
                {config.tagline}
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {config.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 3}
                  rating={ratingsMap.get(product.handle)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-serif text-xl text-foreground">Coming Soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                These products are being prepared. Check back shortly.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary hover:gap-3 transition-all"
              >
                Browse All Products <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-secondary px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
            Why {config.title}
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
            What makes it different.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {config.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col gap-3 p-6 border border-border bg-background"
              >
                <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-t border-border px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
            Perfect For
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground lg:text-4xl">
            Who it&apos;s for.
          </h2>
          <ul className="mt-8 space-y-3">
            {config.whoItsFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "Australian Made" },
              { label: "Cruelty Free" },
              { label: "100% Natural" },
              { label: "Eco-Friendly" },
              { label: "Vegan" },
            ].map((cert) => (
              <div key={cert.label} className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <span className="mt-1.5 text-[10px] text-muted-foreground text-center whitespace-nowrap">
                  {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary text-center">
            FAQ
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground text-center lg:text-4xl">
            Common questions.
          </h2>
          <div className="mt-10 space-y-4">
            {config.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-border bg-background"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-mono text-sm tracking-wide text-foreground">
                  {faq.question}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 lg:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl text-foreground lg:text-3xl">
            {config.tagline}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Free Australian shipping on orders over ${brand.shipping.freeThresholdDomestic}. International shipping available.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-primary hover:gap-3 transition-all"
          >
            Browse All Products <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": config.title,
            "description": config.metaDescription,
            "url": `https://www.${brand.domain}/collections/${handle}`,
            "isPartOf": {
              "@type": "WebSite",
              "name": brand.name,
              "url": `https://www.${brand.domain}`,
            },
            ...(config.faqs.length > 0
              ? {
                  "mainEntity": config.faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer,
                    },
                  })),
                }
              : {}),
          }),
        }}
      />
    </main>
  )
}
