import type { Metadata } from "next"
import Link from "next/link"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Terms & Conditions | ${brand.name}`,
  description: `Read ${brand.name} terms and conditions governing use of our website and purchase of our products.`,
  alternates: {
    canonical: `https://www.${brand.domain}/policies/terms`,
  },
}

export default function TermsPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Terms & Conditions</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Terms &amp; Conditions
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
              These terms govern your use of {brand.domain} and purchase of products from {brand.legalName} ABN {brand.abn} (&ldquo;{brand.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Eligibility</h2>
            <p className="mt-4 text-base leading-relaxed">
              You must be 18 years or older to purchase from our website.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Pricing</h2>
            <p className="mt-4 text-base leading-relaxed">
              All prices are in Australian Dollars (AUD) and include GST where applicable. Prices are
              subject to change without notice. We reserve the right to cancel orders if a pricing
              error occurs.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Orders &amp; Payment</h2>
            <p className="mt-4 text-base leading-relaxed">
              Orders are confirmed by email. Payment is processed securely via Stripe. Stripe supports
              all major credit and debit cards as well as a wide range of payment methods accepted
              globally. If your payment method is supported by Stripe, you can use it at checkout.
              We reserve the right to cancel any order if stock is unavailable, in which case a full
              refund will be issued.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Shipping</h2>
            <p className="mt-4 text-base leading-relaxed">
              Shipping is calculated at checkout. See our{" "}
              <Link
                href="/policies/shipping"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Shipping Policy
              </Link>{" "}
              for full details.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Returns</h2>
            <p className="mt-4 text-base leading-relaxed">
              Subject to the Australian Consumer Law, products purchased from {brand.name} are not
              returnable for change of mind. See our{" "}
              <Link
                href="/policies/returns"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Returns &amp; Refund Policy
              </Link>{" "}
              for full details.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Australian Consumer Law</h2>
            <p className="mt-4 text-base leading-relaxed">
              Our products come with guarantees that cannot be excluded under the Australian Consumer
              Law. You are entitled to a replacement or refund for a major failure and compensation for
              any other reasonably foreseeable loss or damage. Nothing in these terms excludes your
              rights under the Australian Consumer Law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Limitation of Liability</h2>
            <p className="mt-4 text-base leading-relaxed">
              To the extent permitted by law, {brand.name}&apos;s liability is limited to the value of
              the goods purchased. {brand.name} is not liable for indirect or consequential loss howsoever
              caused.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Product Use Disclaimer</h2>
            <p className="mt-4 text-base leading-relaxed">
              Our products are cosmetic and home goods intended for external use only. They are not
              intended to diagnose, treat, cure, or prevent any medical condition. Discontinue use if
              irritation occurs and consult a healthcare professional if needed.
            </p>
            <p className="mt-4 text-base leading-relaxed">
              Essential oils should be diluted before skin application. Keep all products out of reach
              of children. Read the product label before use.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Intellectual Property</h2>
            <p className="mt-4 text-base leading-relaxed">
              All content on {brand.domain} including text, images, and branding is the property of
              {" "}{brand.legalName} and may not be reproduced without written permission.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Changes to Terms</h2>
            <p className="mt-4 text-base leading-relaxed">
              We reserve the right to update these terms at any time. Continued use of the website
              constitutes acceptance of the updated terms.
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
