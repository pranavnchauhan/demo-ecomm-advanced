export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  readTime: string
  image: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "calming-bath-ritual-at-home",
    title: "10 Ways to Create a Calming Bath Ritual at Home",
    excerpt:
      "Transform your bathroom into a spa with mineral-rich bath salts, essential oils, and simple rituals that promote relaxation and better sleep.",
    category: "Self-Care",
    date: "2026-01-30",
    author: "Salt & Stone AU Team",
    readTime: "7 min read",
    image: "/images/blog/bath-ritual.jpg",
    tags: [
      "bath ritual",
      "self care",
      "bath salts",
      "relaxation",
      "wellness",
    ],
  },
  {
    slug: "why-australians-switching-natural-body-care",
    title: "Why Australians Are Switching to Natural Body Care",
    excerpt:
      "From parabens to plant-based, discover why more Australians are choosing natural body care products that are better for their skin and the environment.",
    category: "Natural Living",
    date: "2025-06-17",
    author: "Salt & Stone AU Team",
    readTime: "6 min read",
    image: "/images/blog/natural-skincare.jpg",
    tags: [
      "natural",
      "body care",
      "australian made",
      "clean beauty",
      "eco friendly",
    ],
  },
  {
    slug: "history-of-bath-salts-ancient-to-modern",
    title: "The History of Bath Salts: From Ancient Rituals to Modern Wellness",
    excerpt:
      "Trace the use of mineral-rich salts from ancient Egyptian bathing rituals to modern therapeutic applications. Learn why bath salts remain a cornerstone of natural wellness.",
    category: "Wellness",
    date: "2025-06-17",
    author: "Salt & Stone AU Team",
    readTime: "8 min read",
    image: "/images/blog/essential-oils-guide.jpg",
    tags: [
      "bath salts",
      "history",
      "wellness",
      "minerals",
      "self care",
    ],
  },
  {
    slug: "essential-oils-vs-fragrance-oils",
    title: "Essential Oils vs Fragrance Oils: Which Is Better for You?",
    excerpt:
      "Both smell great, but they are not the same thing. Here is how essential oils and synthetic fragrance oils compare on purity, safety, therapeutic benefits, and environmental impact.",
    category: "Natural Living",
    date: "2026-02-10",
    author: "Salt & Stone AU Team",
    readTime: "7 min read",
    image: "/images/collections/essential-oils.jpg",
    tags: [
      "essential oils",
      "fragrance",
      "natural",
      "clean beauty",
      "aromatherapy",
    ],
  },
  {
    slug: "guide-to-exfoliation-body-scrubs",
    title: "A Guide to Exfoliation: How Body Scrubs Transform Your Skin",
    excerpt:
      "Regular exfoliation removes dead skin cells, promotes circulation, and leaves your skin glowing. Learn the right technique, frequency, and ingredients to look for.",
    category: "Skin Care",
    date: "2026-02-17",
    author: "Salt & Stone AU Team",
    readTime: "8 min read",
    image: "/images/collections/body-scrubs.jpg",
    tags: [
      "body scrub",
      "exfoliation",
      "skin care",
      "natural ingredients",
      "smooth skin",
    ],
  },
  {
    slug: "choosing-the-right-soy-candle",
    title: "Choosing the Right Soy Candle: A Complete Guide",
    excerpt:
      "Not all candles are created equal. This guide covers wick types, wax quality, scent throw, burn time, and how to spot truly natural soy candles versus marketed ones.",
    category: "Home Essentials",
    date: "2026-02-24",
    author: "Salt & Stone AU Team",
    readTime: "6 min read",
    image: "/images/collections/candles.jpg",
    tags: [
      "soy candles",
      "home essentials",
      "natural candles",
      "clean burn",
      "eco friendly",
    ],
  },
  {
    slug: "australian-botanicals-in-body-care",
    title: "5 Australian Botanicals Used in Natural Body Care",
    excerpt:
      "Australia is home to incredible native botanicals with therapeutic properties. Discover five plant ingredients commonly used in natural skincare and body care products.",
    category: "Ingredients",
    date: "2026-03-03",
    author: "Salt & Stone AU Team",
    readTime: "7 min read",
    image: "/images/hero/homepage-hero.jpg",
    tags: [
      "australian botanicals",
      "native plants",
      "natural ingredients",
      "body care",
      "skincare",
    ],
  },
  {
    slug: "simple-self-care-rituals",
    title: "5 Simple Self-Care Rituals for Everyday Wellness",
    excerpt:
      "Enhance your daily routine with five simple self-care rituals using natural body care products, from a morning body scrub to an evening bath soak.",
    category: "Wellness",
    date: "2025-06-17",
    author: "Salt & Stone AU Team",
    readTime: "5 min read",
    image: "/images/collections/bath-salts.jpg",
    tags: [
      "self care",
      "wellness",
      "daily routine",
      "bath soak",
      "natural body care",
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, count)
}
