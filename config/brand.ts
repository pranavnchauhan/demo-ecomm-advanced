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
  name: "Salt & Stone AU",
  legalName: "Salt & Stone Australia Pty Ltd",
  tagline: "Nature. Refined.",
  domain: "saltandstone.com.au",
  supportEmail: "hello@saltandstone.com.au",
  abn: "00 000 000 000", // placeholder — update when ABN is registered

  // ── Visual ────────────────────────────────────────────────────────────
  // Tip: use https://coolors.co to generate a palette, then drop values here.
  colors: {
    primary: "#4A5B4F",     // sage green — nav, buttons, headings
    accent: "#C4A875",      // warm gold — highlights, hover states, badges
    background: "#F5F3EF",  // warm off-white — page background
    foreground: "#1A1A1A",  // near black — body text
    muted: "#8B8B8B",       // grey — secondary text, borders
  },
  fonts: {
    heading: "Cormorant Garamond", // elegant serif — import via next/font/google
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
      { drop: "Chemicals", keep: "Clean" },
      { drop: "Synthetic", keep: "Natural" },
      { drop: "Harsh", keep: "Gentle" },
      { drop: "Artificial", keep: "Pure" },
    ],
    subtitle:
      "Handcrafted natural body care and home essentials. Australian made, never tested on animals.",
    ctaPrimary: { text: "Shop Now", href: "/shop" },
    ctaSecondary: { text: "Our Story", href: "/about" },
  },

  // ── Collections ───────────────────────────────────────────────────────
  // Each handle must match the Shopify collection handle exactly.
  // Add or remove collections here — the nav, sitemap, and collection pages
  // all read from this array.
  collections: [
    {
      handle: "bath-salts",
      title: "Bath Salts",
      tagline: "Drop The Chemicals. Keep The Clean.",
      description:
        "Mineral-rich bath salts handcrafted with Himalayan pink salt, dead sea salt, and pure essential oils. Soak away the day, naturally.",
      image: "/images/collections/bath-salts.jpg",
    },
    {
      handle: "body-scrubs",
      title: "Body Scrubs",
      tagline: "Drop The Synthetic. Keep The Natural.",
      description:
        "Exfoliating body scrubs made with raw sugar, coconut oil, and botanical extracts. Smooth skin without the nasties.",
      image: "/images/collections/body-scrubs.jpg",
    },
    {
      handle: "essential-oils",
      title: "Essential Oils",
      tagline: "Drop The Harsh. Keep The Gentle.",
      description:
        "Therapeutic-grade essential oil blends sourced from Australian and global botanicals. For diffusing, bathing, and everyday wellness.",
      image: "/images/collections/essential-oils.jpg",
    },
    {
      handle: "candles",
      title: "Soy Candles",
      tagline: "Drop The Artificial. Keep The Pure.",
      description:
        "Hand-poured soy wax candles with cotton wicks and essential oil fragrances. Clean burn, no toxins, beautiful scent throw.",
      image: "/images/collections/candles.jpg",
    },
    {
      handle: "hand-wash",
      title: "Hand Wash",
      tagline: "Drop The Irritants. Keep The Care.",
      description:
        "Gentle foaming hand wash with plant-derived cleansers and moisturising botanicals. Kind to sensitive skin.",
      image: "/images/collections/hand-wash.jpg",
    },
  ],

  // ── Trust Bar ─────────────────────────────────────────────────────────
  // These rotate in a horizontal marquee across the page.
  trustBar: [
    "Australian Made & Owned",
    "100% Natural Ingredients",
    "Cruelty Free",
    "Vegan Friendly",
    "No Parabens",
    "No Sulphates",
    "Eco-Friendly Packaging",
    "Handcrafted in Small Batches",
  ],

  // ── Social ────────────────────────────────────────────────────────────
  // Only include platforms the brand actively uses. Remove unused ones.
  social: {
    instagram: "https://instagram.com/saltandstone.au",
    facebook: "https://facebook.com/saltstoneau",
    tiktok: "https://tiktok.com/@saltandstone.au",
    pinterest: "https://pinterest.com/saltstoneau",
  },

  // ── Shipping ──────────────────────────────────────────────────────────
  shipping: {
    freeThresholdDomestic: 79,        // free shipping over $79 AUD within Australia
    freeThresholdInternational: 149,   // free shipping over $149 AUD internationally
    currency: "AUD",
  },

  // ── SEO ───────────────────────────────────────────────────────────────
  seo: {
    titleTemplate: "%s | Salt & Stone AU",
    defaultTitle: "Salt & Stone AU | Nature. Refined.",
    defaultDescription:
      "Handcrafted natural body care and home essentials. Australian made with pure ingredients. Bath salts, body scrubs, essential oils, and soy candles.",
    keywords: [
      "natural body care",
      "australian made",
      "bath salts",
      "body scrub",
      "essential oils",
      "soy candles",
      "cruelty free",
      "vegan skincare",
      "natural hand wash",
      "eco friendly body care",
    ],
  },

  // ── Certifications ────────────────────────────────────────────────────
  // Shown as badges on the homepage trust section and product pages.
  certifications: [
    "Cruelty Free",
    "Vegan",
    "Australian Made",
    "Eco-Friendly",
  ],

  // ── Testimonials ──────────────────────────────────────────────────────
  // Customer reviews displayed on the homepage and optionally on product pages.
  testimonials: [
    {
      name: "Sarah M.",
      location: "Sydney",
      text: "The lavender bath salts are incredible. My skin has never felt softer.",
      rating: 5,
    },
    {
      name: "James K.",
      location: "Melbourne",
      text: "Finally found a body scrub that actually uses natural ingredients. Love it.",
      rating: 5,
    },
    {
      name: "Emily R.",
      location: "Brisbane",
      text: "The soy candles burn beautifully and the scents are divine. Will be ordering more.",
      rating: 5,
    },
    {
      name: "Olivia T.",
      location: "Perth",
      text: "The hand wash smells amazing and doesn't dry out my hands. Switched the whole house over.",
      rating: 5,
    },
    {
      name: "Daniel W.",
      location: "Adelaide",
      text: "Bought the essential oil blend for my diffuser — the quality is next level. So much better than supermarket brands.",
      rating: 5,
    },
  ],
}

// ---------------------------------------------------------------------------
// Type export — import this in components for autocomplete
// ---------------------------------------------------------------------------

export type Brand = typeof brand
