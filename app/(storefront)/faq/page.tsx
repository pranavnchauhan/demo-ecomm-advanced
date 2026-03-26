"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { FREE_SHIPPING_AU, FREE_SHIPPING_INTL } from "@/lib/constants"

interface QAItem {
  q: string
  a: React.ReactNode
}

interface Section {
  id: string
  title: string
  items: QAItem[]
}

const sections: Section[] = [
  {
    id: "products",
    title: "About Our Products",
    items: [
      {
        q: "What makes your products natural?",
        a: "All Salt & Stone AU products are made with 100% natural ingredients. We use no parabens, no sulphates, no synthetic fragrances, and no artificial colours. Every ingredient is plant-based or mineral-derived and clearly listed on the label.",
      },
      {
        q: "Are your products cruelty free and vegan?",
        a: "Yes. All Salt & Stone AU products are cruelty free and never tested on animals. All products are also 100% vegan with no animal-derived ingredients.",
      },
      {
        q: "Where are your products made?",
        a: "All products are handcrafted in small batches on the NSW coast of Australia. We are 100% Australian owned and operated, supporting local suppliers and communities.",
      },
      {
        q: "How should I store my products?",
        a: "Store products in a cool, dry place away from direct sunlight. Bath salts and body scrubs should be kept sealed when not in use. Soy candles should be stored upright. Essential oils should be kept in a dark, cool location.",
      },
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Our products are formulated with gentle, natural ingredients suitable for most skin types. However, if you have particularly sensitive skin or known allergies, we recommend checking the full ingredient list and patch testing before use.",
      },
      {
        q: "Is your packaging eco-friendly?",
        a: "All packaging is recyclable, compostable, or reusable. We use glass jars, kraft paper, and soy-based inks. No single-use plastics.",
      },
    ],
  },
  {
    id: "bath-salts",
    title: "Bath Salts",
    items: [
      {
        q: "How much bath salt should I use per bath?",
        a: "We recommend 2 to 4 tablespoons per bath. Add to warm running water and allow the salts to dissolve fully before soaking for 15 to 20 minutes.",
      },
      {
        q: "What minerals are in your bath salts?",
        a: "Our bath salts contain Himalayan pink salt and dead sea salt, which are naturally rich in magnesium, calcium, potassium, and over 80 trace minerals that support skin health and relaxation.",
      },
      {
        q: "Can I use bath salts if I have dry skin?",
        a: "Yes. The minerals in our bath salts can actually help hydrate and soften dry skin. We recommend moisturising after your bath for best results.",
      },
    ],
  },
  {
    id: "candles",
    title: "Soy Candles",
    items: [
      {
        q: "How long do your soy candles burn?",
        a: "Burn times vary by size, but our standard candles burn for approximately 40 to 50 hours. Always trim the wick to 5mm before each burn for the best experience.",
      },
      {
        q: "Why soy wax instead of paraffin?",
        a: "Soy wax is a natural, renewable resource that burns cleaner than paraffin. It produces less soot, lasts longer, and holds fragrance better. Paraffin wax is petroleum-derived and releases toxins when burned.",
      },
      {
        q: "Are your candle fragrances natural?",
        a: "Yes. All our candles are scented with pure essential oils only. No synthetic fragrance oils are used.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & Shipping",
    items: [
      {
        q: "Do you ship internationally?",
        a: (
          <>
            Yes, we ship worldwide via Australia Post. Shipping rates are calculated at checkout
            based on weight and destination. Free AU shipping on orders over ${FREE_SHIPPING_AU}. Free
            international shipping on orders over ${FREE_SHIPPING_INTL}. See our{" "}
            <Link
              href="/policies/shipping"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Shipping Policy
            </Link>{" "}
            for full details.
          </>
        ),
      },
      {
        q: "How long does delivery take?",
        a: "Within Australia: approximately 3 to 7 business days metro, 5 to 10 business days regional. International: approximately 10 to 21 business days. Express options are available at checkout.",
      },
      {
        q: "How do I track my order?",
        a: "You will receive a tracking email once your order is dispatched. Use the tracking number to follow your parcel on the Australia Post website.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: (
          <>
            Contact us immediately at{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
            . We process orders quickly, so if your order has already been dispatched we are unable
            to make changes.
          </>
        ),
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards as well as a wide range of payment methods supported globally by our payment provider.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes. All payments are processed by our payment provider which is PCI-DSS Level 1 compliant, the highest level of payment security certification available. We never store your card details.",
      },
      {
        q: "Can I return an opened product?",
        a: (
          <>
            Subject to the Australian Consumer Law, products are not returnable for change of mind.
            If your product arrives damaged or faulty, contact us at{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>{" "}
            with your order number and photos. See our{" "}
            <Link
              href="/policies/returns"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Returns &amp; Refund Policy
            </Link>{" "}
            for full details.
          </>
        ),
      },
      {
        q: "Do you offer discounts or promotions?",
        a: "Yes! Sign up to our email list to receive exclusive offers and be the first to hear about new products and promotions.",
      },
      {
        q: "How does the 10% first order discount work?",
        a: (
          <>
            Use the code{" "}
            <span className="font-mono tracking-wider">WELCOME10</span> at checkout to get
            10% off your first order. The code is valid for new customers only and can be used
            once per customer.
          </>
        ),
      },
    ],
  },
]

function AccordionItem({ item, isOpen, onToggle }: { item: QAItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <h3 className="font-serif text-lg text-foreground pr-4">{item.q}</h3>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-base leading-relaxed text-foreground/70 space-y-2">{item.a}</div>
        </div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const filteredSections = activeFilter
    ? sections.filter((section) => section.id === activeFilter)
    : sections

  const toggleItem = (questionKey: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(questionKey)) {
        next.delete(questionKey)
      } else {
        next.add(questionKey)
      }
      return next
    })
  }

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="px-6 pt-32 pb-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">FAQ</span>
          </nav>
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* Filter buttons */}
      <section className="border-b border-border px-6 py-6 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                activeFilter === null
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveFilter(section.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  activeFilter === section.id
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-16">

          {filteredSections.map((section) => (
            <div key={section.id}>
              <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                {section.title}
              </h2>
              <div className="mt-8">
                {section.items.map((item) => {
                  const questionKey = `${section.id}-${item.q}`
                  return (
                    <AccordionItem
                      key={item.q}
                      item={item}
                      isOpen={openItems.has(questionKey)}
                      onToggle={() => toggleItem(questionKey)}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="rounded border border-border bg-secondary px-6 py-8 text-center">
            <p className="font-serif text-xl text-foreground">Still have a question?</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Email us at{" "}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              or{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                visit our Contact page
              </Link>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              We&apos;ll get back to you within 1 to 2 business days.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
