import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/contact/contact-form"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Contact ${brand.name} | Get in Touch`,
  description: `Have a question about our products? Contact the ${brand.name} team. We are happy to help with orders, product information, and general enquiries.`,
  alternates: {
    canonical: `https://www.${brand.domain}/contact`,
  },
}

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* Content */}
      <section className="px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-16">
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <div className="mb-12">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">Contact</span>
            </nav>
            <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
              We&apos;d love to hear from you
            </h1>
          </div>

          <div className="grid gap-16 lg:grid-cols-3 lg:items-start">
            {/* Left: Contact info */}
            <div className="space-y-10 self-start">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-3">
                  Email
                </p>
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="text-sm text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {brand.supportEmail}
                </a>
              </div>

              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-3">
                  Response Time
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We aim to respond within 1 to 2 business days.
                </p>
              </div>

              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-3">
                  Helpful Links
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/faq"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policies/shipping"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policies/returns"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      Returns &amp; Refunds
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
