import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Natural Body Care Questions Answered",
  description: "Answers to common questions about natural body care products, bath salts, body scrubs, essential oils, soy candles, shipping, and orders. Australian made by Salt & Stone AU.",
  alternates: {
    canonical: "https://www.saltandstone.com.au/faq",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes your products natural?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All Salt & Stone AU products are made with 100% natural ingredients. We use no parabens, no sulphates, no synthetic fragrances, and no artificial colours. Every ingredient is plant-based or mineral-derived.",
      },
    },
    {
      "@type": "Question",
      "name": "Are your products cruelty free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All Salt & Stone AU products are cruelty free and never tested on animals. All products are also 100% vegan.",
      },
    },
    {
      "@type": "Question",
      "name": "Where are your products made?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All products are handcrafted in small batches on the NSW coast of Australia. We are 100% Australian owned and operated.",
      },
    },
    {
      "@type": "Question",
      "name": "Do you ship internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we ship worldwide via Australia Post. Free AU shipping on orders over $79. Free international shipping on orders over $149.",
      },
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit and debit cards as well as a wide range of payment methods supported globally by our payment provider. All payments are PCI-DSS Level 1 compliant.",
      },
    },
    {
      "@type": "Question",
      "name": "Is your packaging eco-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All packaging is recyclable, compostable, or reusable. We use glass jars, kraft paper, and soy-based inks. No single-use plastics.",
      },
    },
  ],
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
