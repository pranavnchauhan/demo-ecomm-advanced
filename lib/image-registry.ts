/**
 * Image Registry -- Tracks ALL uploaded brand images.
 * `used: true` = currently assigned to a product, page, or blog post.
 * `used: false` = available for future use (new blog posts, new products, homepage sections, etc.)
 *
 * Videos are tracked at the bottom separately.
 */

export type ImageEntry = {
  id: number
  filename: string
  sourceUrl: string
  category: "product" | "lifestyle" | "hero" | "blog" | "marketing" | "collection"
  description: string
  used: boolean
  usedIn?: string
}

export const imageRegistry: ImageEntry[] = [
  // Hero images
  { id: 1, filename: "homepage-hero.jpg", sourceUrl: "/images/hero/homepage-hero.jpg", category: "hero", description: "Homepage hero image — natural body care products", used: true, usedIn: "Homepage hero section" },

  // Collection images
  { id: 2, filename: "bath-salts.jpg", sourceUrl: "/images/collections/bath-salts.jpg", category: "collection", description: "Bath salts collection hero", used: true, usedIn: "Collections page + About page" },
  { id: 3, filename: "body-scrubs.jpg", sourceUrl: "/images/collections/body-scrubs.jpg", category: "collection", description: "Body scrubs collection hero", used: true, usedIn: "Collections page + About page" },
  { id: 4, filename: "essential-oils.jpg", sourceUrl: "/images/collections/essential-oils.jpg", category: "collection", description: "Essential oils collection hero", used: true, usedIn: "Collections page" },
  { id: 5, filename: "candles.jpg", sourceUrl: "/images/collections/candles.jpg", category: "collection", description: "Soy candles collection hero", used: true, usedIn: "Collections page + About page" },

  // Category images
  { id: 6, filename: "bath-salts-cat.jpg", sourceUrl: "/images/categories/bath-salts.jpg", category: "collection", description: "Bath salts category tile", used: true, usedIn: "Category showcase" },
  { id: 7, filename: "body-scrubs-cat.jpg", sourceUrl: "/images/categories/body-scrubs.jpg", category: "collection", description: "Body scrubs category tile", used: true, usedIn: "Category showcase" },
  { id: 8, filename: "essential-oils-cat.jpg", sourceUrl: "/images/categories/essential-oils.jpg", category: "collection", description: "Essential oils category tile", used: true, usedIn: "Category showcase" },
  { id: 9, filename: "candles-cat.jpg", sourceUrl: "/images/categories/candles.jpg", category: "collection", description: "Candles category tile", used: true, usedIn: "Category showcase" },

  // About page
  { id: 10, filename: "about-workshop.jpg", sourceUrl: "/images/about-workshop.jpg", category: "lifestyle", description: "Workshop / crafting scene for About page", used: true, usedIn: "About page hero" },

  // Blog images
  { id: 11, filename: "blog-2-creative-ways.jpg", sourceUrl: "/images/blog/blog-2-creative-ways.jpg", category: "blog", description: "Bath ritual blog post image", used: true, usedIn: "Blog: 10 Ways to Create a Calming Bath Ritual" },
  { id: 12, filename: "blog-3-organic-extract.jpg", sourceUrl: "/images/blog/blog-3-organic-extract.jpg", category: "blog", description: "Natural body care blog post image", used: true, usedIn: "Blog: Why Australians Are Switching" },
  { id: 13, filename: "blog-4-discover-history.jpg", sourceUrl: "/images/blog/blog-4-discover-history.jpg", category: "blog", description: "History of bath salts blog post image", used: true, usedIn: "Blog: History of Bath Salts" },
]

// Helper: Get all unused images
export function getUnusedImages() {
  return imageRegistry.filter((img) => !img.used)
}

// Helper: Get unused images by category
export function getUnusedByCategory(category: ImageEntry["category"]) {
  return imageRegistry.filter((img) => !img.used && img.category === category)
}
