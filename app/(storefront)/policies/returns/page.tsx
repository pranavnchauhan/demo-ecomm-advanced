import type { Metadata } from "next"
import Link from "next/link"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Returns & Refund Policy | ${brand.name}`,
  description: `Not happy? Learn about ${brand.name} hassle-free returns, refund process and eligibility conditions.`,
  alternates: {
    canonical: `https://www.${brand.domain}/policies/returns`,
  },
}

export default function ReturnsPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Returns & Refund Policy</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Returns &amp; Refund Policy
          </h1>
          <p className="mt-4 font-sans text-xs tracking-wider text-muted-foreground">
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pt-8 pb-20 lg:px-12 lg:pt-12 lg:pb-28">
        <div className="mx-auto max-w-3xl space-y-12 text-foreground/80">

          <div>
            <p className="text-base leading-relaxed">
              Subject to the Competition and Consumer Act 2010 (Cth) and the Australian Consumer Law,
              products purchased from {brand.name} are not returnable for change of mind.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Faulty or Damaged Products</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed">
              <p>
                {brand.name} will fully refund or replace any goods found to be faulty or damaged upon
                delivery. To make a claim, contact{" "}
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {brand.supportEmail}
                </a>{" "}
                with your order number and photos of the product and packaging.
              </p>
              <p>
                Refunds will be processed in the same form as your original payment.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Your Australian Consumer Law Rights</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed">
              <p>
                The Australian Consumer Law may apply to your purchase, in which case certain statutory
                guarantees which cannot be excluded will apply. You may obtain details of these
                guarantees by visiting the ACCC website at{" "}
                <a
                  href="https://www.accc.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                >
                  accc.gov.au
                </a>
                .
              </p>
              <p>
                Nothing in this policy excludes your rights under the Australian Consumer Law.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Opened Products</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed">
              <p>
                For hygiene reasons, opened body care products (scrubs, bath salts, hand wash) and
                burned candles cannot be returned for change of mind.
              </p>
              <p>
                If you believe a product is faulty, please contact us with your order number and
                photos of the issue. We will arrange a replacement or refund promptly.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">International Orders</h2>
            <p className="mt-4 text-base leading-relaxed">
              {brand.name} is not responsible for parcels seized, damaged, or destroyed by customs. Import
              duties and return shipping costs for international orders are the buyer&apos;s
              responsibility.
            </p>
          </div>

          <div className="rounded border border-border bg-secondary px-6 py-5 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-sans text-xs tracking-wider uppercase">Governing Law:</span>{" "}
              New South Wales, Australia
            </p>
            <p>
              <span className="font-sans text-xs tracking-wider uppercase">Contact:</span>{" "}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {brand.supportEmail}
              </a>
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
