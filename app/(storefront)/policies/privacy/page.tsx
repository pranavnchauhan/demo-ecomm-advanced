import type { Metadata } from "next"
import Link from "next/link"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Privacy Policy | ${brand.name}`,
  description: `How ${brand.name} collects, uses and protects your personal information in accordance with Australian privacy law.`,
  alternates: {
    canonical: `https://www.${brand.domain}/policies/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Privacy Policy</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Privacy Policy
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
              {brand.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
              protecting your personal information in accordance with the Australian Privacy Act 1988
              (Cth).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">What We Collect</h2>
            <ul className="mt-4 space-y-2 text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Name, email address, phone number, and delivery address (when you place an order)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  Payment information, processed securely by our payment provider. We never store
                  your card details
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Browsing behaviour, device information, and cookies</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Email marketing preferences (when you opt in)</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">How We Use Your Information</h2>
            <ul className="mt-4 space-y-2 text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>To process and fulfil your orders</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>To send order confirmations and shipping updates</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  To send marketing emails (only with your consent, unsubscribe anytime)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>To improve our website and customer experience</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Third Parties</h2>
            <p className="mt-4 text-base leading-relaxed">
              We share your information with trusted service partners where necessary to deliver our
              products and services to you. These include:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Payment processing (Stripe)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Shipping and logistics (Australia Post)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Analytics and advertising (Google Analytics, Meta)</span>
              </li>
            </ul>
            <p className="mt-4 text-base leading-relaxed">
              These providers may operate servers internationally and are bound by their own privacy
              policies. All partners are required to handle your data securely and in accordance with
              applicable privacy laws. We do not sell your personal data to any third party.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Data Retention</h2>
            <p className="mt-4 text-base leading-relaxed">
              We retain order records for 7 years to comply with Australian tax law. Marketing data
              is retained until you unsubscribe. You may request deletion of your personal data at
              any time, subject to legal retention requirements.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Your Rights</h2>
            <p className="mt-4 text-base leading-relaxed">
              You have the right to access, correct, or request deletion of your personal data at any
              time. Contact us at{" "}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {brand.supportEmail}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Cookies</h2>
            <p className="mt-4 text-base leading-relaxed">
              We use cookies to operate our website and improve your experience. These fall into two
              categories:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Essential cookies</strong> - required for core site functionality such as
                  your shopping cart, checkout session, and login state. These cannot be disabled.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong>Tracking cookies</strong> - used by Google Analytics and Meta Pixel to
                  understand site usage and measure advertising performance. These cookies require
                  your consent via the cookie banner displayed on your first visit.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-base leading-relaxed">
              You can manage cookie preferences in your browser settings, though disabling essential
              cookies may affect site functionality.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground">Cookie Consent</h2>
            <p className="mt-4 text-base leading-relaxed">
              When you first visit {brand.domain}, you will be prompted to accept or manage cookies
              via our cookie banner. Tracking cookies will only be activated after you provide
              consent. You can change your preferences at any time through your browser settings.
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
