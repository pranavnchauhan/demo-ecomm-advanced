// SINGLE SOURCE OF TRUTH — edit this file to rebrand the entire site
//
// VA INSTRUCTIONS:
// When setting up a new client site, duplicate this file and update every value.
// Components across the entire site read from this config — change it here,
// it changes everywhere. No need to touch any component files.
//
// Sections:
//   1. Identity      — business name, domain, contact info
//   2. Visual         — colors, fonts, logos
//   3. Hero           — homepage hero content (rolling text, CTAs)
//   4. Collections    — product categories with handles matching Shopify
//   5. Trust Bar      — scrolling marquee claims
//   6. Social         — social media profile URLs
//   7. Shipping       — free shipping thresholds
//   8. SEO            — meta titles, descriptions, keywords
//   9. Certifications — badges/icons shown on site
//  10. Testimonials   — customer reviews for homepage/product pages

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RollingTextItem {
  /** The word that gets "dropped" (strikethrough animation) */
  drop: string
  /** The word that replaces it */
  keep: string
}

export interface CTA {
  text: string
  href: string
}

export interface HeroConfig {
  /** Rolling text pairs for the hero headline animation */
  rollingText: RollingTextItem[]
  /** Paragraph below the headline */
  subtitle: string
  /** Primary call-to-action button */
  ctaPrimary: CTA
  /** Secondary / ghost button */
  ctaSecondary: CTA
}

export interface CollectionConfig {
  /** URL-safe slug — must match the Shopify collection handle */
  handle: string
  /** Display name */
  title: string
  /** Short tagline shown on the collection hero */
  tagline: string
  /** Optional description for the collection page */
  description?: string
  /** Path to the collection hero image */
  image?: string
}

export interface Testimonial {
  name: string
  location: string
  text: string
  /** 1–5 star rating */
  rating: number
}

export interface BrandConfig {
  // --- Identity ---
  name: string
  legalName: string
  tagline: string
  domain: string
  supportEmail: string
  /** Australian Business Number — placeholder until registered */
  abn: string

  // --- Visual ---
  colors: {
    primary: string
    accent: string
    background: string
    foreground: string
    muted: string
  }
  fonts: {
    /** Google Fonts heading family — import in layout.tsx */
    heading: string
    /** Body font stack */
    body: string
  }
  logo: {
    /** Default logo (dark backgrounds use logo-white) */
    default: string
    /** White/inverted variant for dark sections */
    white: string
    /** Square icon for favicons & app icons */
    icon: string
  }
  /** Open Graph share image (1200x630 recommended) */
  ogImage: string

  // --- Content ---
  hero: HeroConfig
  collections: CollectionConfig[]
  trustBar: string[]

  // --- Social ---
  social: {
    instagram?: string
    facebook?: string
    tiktok?: string
    pinterest?: string
    youtube?: string
    linkedin?: string
  }

  // --- Shipping ---
  shipping: {
    /** Free domestic shipping above this amount (in local currency) */
    freeThresholdDomestic: number
    /** Free international shipping above this amount */
    freeThresholdInternational: number
    /** ISO 4217 currency code */
    currency: string
  }

  // --- SEO ---
  seo: {
    /** %s is replaced with the page title */
    titleTemplate: string
    /** Fallback title when no page title is set */
    defaultTitle: string
    /** Homepage meta description (max ~160 chars) */
    defaultDescription: string
    /** Seed keywords for meta tags */
    keywords: string[]
  }

  // --- Certifications ---
  /** Badge labels shown in the trust section / product pages */
  certifications: string[]

  // --- Testimonials ---
  testimonials: Testimonial[]
}

// ---------------------------------------------------------------------------
// Brand configuration — update everything below for a new client
// ---------------------------------------------------------------------------

export const brand: BrandConfig = {
  // ── Identity ──────────────────────────────────────────────────────────
  name: "Terra Bloom",
  legalName: "Terra Bloom Pty Ltd",
  tagline: "Grow your space.",
  domain: "terrabloom.com.au",
  supportEmail: "hello@terrabloom.com.au",
  abn: "00 000 000 000", // placeholder — update when ABN is registered

  // ── Visual ────────────────────────────────────────────────────────────
  colors: {
    primary: "#2D6A4F",     // deep green — nav, buttons, headings
    accent: "#95D5B2",      // light mint green — highlights, hover states, badges
    background: "#FAFDF7",  // very light green-white — page background
    foreground: "#1B1B1B",  // near black — body text
    muted: "#7C8B7E",       // muted green-grey — secondary text, borders
  },
  fonts: {
    heading: "DM Serif Display", // elegant serif — import via next/font/google
    body: "system-ui, sans-serif", // fast system font stack for body copy
  },
  logo: {
    default: "/images/logo.svg",
    white: "/images/logo-white.svg",
    icon: "/images/logo-icon.svg",
  },
  ogImage: "/images/og-image.png",

  // ── Hero ──────────────────────────────────────────────────────────────
  // The homepage hero cycles through these "Drop X / Keep Y" pairs.
  hero: {
    rollingText: [
      { drop: "Plastic", keep: "Fiber" },
      { drop: "Boring", keep: "Beautiful" },
      { drop: "Fragile", keep: "Durable" },
      { drop: "Indoor Only", keep: "Everywhere" },
    ],
    subtitle:
      "Premium fiber planters for indoor & outdoor living. Lightweight, weather-resistant, UV-protected. Designed in Australia.",
    ctaPrimary: { text: "Shop Planters", href: "/shop" },
    ctaSecondary: { text: "Our Story", href: "/about" },
  },

  // ── Collections ───────────────────────────────────────────────────────
  // Each handle must match the Shopify collection handle exactly.
  collections: [
    {
      handle: "indoor-pots",
      title: "Indoor Pots",
      tagline: "Bring life to every room.",
      description:
        "Contemporary indoor planters crafted from premium fiber material. Lightweight yet durable, perfect for living rooms, offices, and bedrooms.",
      image: "/images/collections/indoor-pots.jpg",
    },
    {
      handle: "outdoor-planters",
      title: "Outdoor Planters",
      tagline: "Built for the elements.",
      description:
        "Weather-resistant outdoor planters with UV protection. From patios to gardens, these planters handle sun, rain, and frost with style.",
      image: "/images/collections/outdoor-planters.jpg",
    },
    {
      handle: "hanging-pots",
      title: "Hanging Pots",
      tagline: "Elevate your greenery.",
      description:
        "Space-saving hanging planters in modern designs. Perfect for balconies, verandahs, and small spaces.",
      image: "/images/collections/hanging-pots.jpg",
    },
    {
      handle: "tabletop",
      title: "Tabletop",
      tagline: "Small pots, big impact.",
      description:
        "Compact planters for desks, windowsills, and dining tables. Succulents, herbs, and small plants never looked better.",
      image: "/images/collections/tabletop.jpg",
    },
    {
      handle: "large-planters",
      title: "Large Planters",
      tagline: "Make a statement.",
      description:
        "Floor-standing planters for feature plants, trees, and large arrangements. The centrepiece your space deserves.",
      image: "/images/collections/large-planters.jpg",
    },
  ],

  // ── Trust Bar ─────────────────────────────────────────────────────────
  trustBar: [
    "Premium Fiber Material",
    "UV Protected",
    "Weather Resistant",
    "Lightweight & Durable",
    "Eco-Friendly",
    "Recyclable",
    "7-Day Delivery",
    "Quality Guaranteed",
  ],

  // ── Social ────────────────────────────────────────────────────────────
  social: {
    instagram: "https://instagram.com/terrabloom.au",
    facebook: "https://facebook.com/terrabloom",
    pinterest: "https://pinterest.com/terrabloom",
  },

  // ── Shipping ──────────────────────────────────────────────────────────
  shipping: {
    freeThresholdDomestic: 99,        // free shipping over $99 AUD within Australia
    freeThresholdInternational: 199,   // free shipping over $199 AUD internationally
    currency: "AUD",
  },

  // ── SEO ───────────────────────────────────────────────────────────────
  seo: {
    titleTemplate: "%s | Terra Bloom",
    defaultTitle: "Terra Bloom | Premium Fiber Planters",
    defaultDescription:
      "Premium fiber planters for indoor and outdoor living. Lightweight, weather-resistant, UV-protected. Designed in Australia, delivered to your door.",
    keywords: [
      "planters",
      "fiber pots",
      "indoor plants",
      "outdoor planters",
      "plant pots",
      "garden pots",
      "australian planters",
      "modern planters",
      "lightweight pots",
      "UV protected planters",
    ],
  },

  // ── Certifications ────────────────────────────────────────────────────
  certifications: [
    "UV Protected",
    "Weather Resistant",
    "Eco-Friendly",
    "Quality Guaranteed",
  ],

  // ── Testimonials ──────────────────────────────────────────────────────
  testimonials: [
    {
      name: "Priya S.",
      location: "Sydney",
      text: "The Apple Shape Pot is stunning. So much lighter than ceramic but looks just as premium. My monstera loves it.",
      rating: 5,
    },
    {
      name: "Raj K.",
      location: "Melbourne",
      text: "Ordered 4 outdoor planters for our patio. Survived a Melbourne winter with zero damage. Highly recommend.",
      rating: 5,
    },
    {
      name: "Sarah L.",
      location: "Brisbane",
      text: "The tabletop pots are perfect for my herb garden. Clean design, great quality, and they arrived in 5 days.",
      rating: 5,
    },
    {
      name: "Michael T.",
      location: "Perth",
      text: "We renovated our office courtyard with Terra Bloom large planters. The team couldn't believe they're not stone.",
      rating: 5,
    },
    {
      name: "Anita D.",
      location: "Adelaide",
      text: "Love that these are recyclable. Finally a planter brand that cares about sustainability. Beautiful products too.",
      rating: 5,
    },
  ],
}

// ---------------------------------------------------------------------------
// Type export — import this in components for autocomplete
// ---------------------------------------------------------------------------

export type Brand = typeof brand
