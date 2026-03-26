import type { Metadata } from "next"
import Link from "next/link"
import { FREE_SHIPPING_AU, FREE_SHIPPING_INTL } from "@/lib/constants"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Shipping Policy | ${brand.name}`,
  description: `Free AU shipping over $${brand.shipping.freeThresholdDomestic}. Learn about ${brand.name} delivery times, shipping rates and international orders.`,
  alternates: {
    canonical: `https://www.${brand.domain}/policies/shipping`,
  },
}

export default function ShippingPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shipping Policy</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Shipping Policy
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
            <h2 className="font-serif text-2xl text-foreground">Shipping</h2>
            <p className="mt-4 text-base leading-relaxed">
              We offer shipping through Australia Post for all orders. Shipping rates and free shipping
              thresholds are displayed at checkout. Express options are also available. Please note
              transit times mentioned at checkout are approximate only from Australia Post. {brand.name}
              {" "}does not warrant this information.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Free Shipping Thresholds</h2>
            <p className="mt-4 text-base leading-relaxed">
              We offer free shipping on qualifying orders:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed list-disc pl-6">
              <li><strong>Australia:</strong> Free standard shipping on orders over ${FREE_SHIPPING_AU} AUD</li>
              <li><strong>International:</strong> Free standard shipping on orders over ${FREE_SHIPPING_INTL} AUD</li>
            </ul>
            <p className="mt-4 text-base leading-relaxed">
              Express shipping options are available at checkout for an additional cost. Free shipping
              applies to standard delivery only. Shipping is calculated on the total order value after
              any discounts are applied.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Packaging</h2>
            <p className="mt-4 text-base leading-relaxed">
              All orders are carefully packed using eco-friendly materials including recycled cardboard,
              compostable void fill, and paper tape. Glass items are individually wrapped for
              protection during transit.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">
              Important Disclaimer for International Orders
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Duties and Taxes
                </h3>
                <p className="mt-3 text-base leading-relaxed">
                  Import duties, taxes, and brokerage fees are not included in the product price or
                  shipping cost. These charges are the buyer&apos;s responsibility. Please check with
                  your country&apos;s customs office to determine if additional costs apply.
                </p>
              </div>

              <div>
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Regulations and Restrictions
                </h3>
                <p className="mt-3 text-base leading-relaxed">
                  By placing an international order, the buyer is responsible for obtaining
                  information regarding their country&apos;s laws, regulations, and restrictions. If a
                  product is seized, damaged, or destroyed by customs, {brand.name} will not be responsible
                  for the losses, product, or shipping refunds.
                </p>
                <p className="mt-3 text-base leading-relaxed">
                  Products may be exposed to varying temperatures during transit. {brand.name} does not
                  guarantee product condition for orders shipped to regions experiencing extreme
                  temperatures. We recommend choosing express shipping during summer months for
                  temperature-sensitive products such as candles.
                </p>
              </div>
            </div>
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
