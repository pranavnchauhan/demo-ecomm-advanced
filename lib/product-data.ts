import type { Product } from "@/lib/shopify/types"

/**
 * Static product data for Salt & Stone AU demo.
 * Used as fallback when no Shopify store is connected.
 */

function makeImages(imagePath: string, productName: string) {
  return {
    edges: [
      {
        node: {
          url: imagePath,
          altText: `${productName} - Salt & Stone AU`,
        },
      },
    ],
  }
}

export const staticProducts: Product[] = [
  {
    id: "static-himalayan-pink-bath-salts",
    title: "Himalayan Pink Bath Salts - 500g",
    description:
      "Mineral-rich Himalayan pink salt harvested from ancient sea deposits. Infused with lavender and chamomile essential oils for a deeply calming bath experience. Contains over 80 trace minerals to nourish and detoxify skin. Handcrafted in Australia.",
    descriptionHtml:
      "<p>Mineral-rich <strong>Himalayan pink salt</strong> harvested from ancient sea deposits.</p><ul><li>Infused with lavender and chamomile essential oils</li><li>Over 80 trace minerals for skin health</li><li>500g resealable kraft pouch</li><li>Handcrafted in small batches in Australia</li><li>No parabens, no sulphates, no synthetics</li></ul>",
    handle: "himalayan-pink-bath-salts-500g",
    availableForSale: true,
    productType: "Bath Salts",
    options: [{ id: "opt-1", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/bath-salts.jpg", "Himalayan Pink Bath Salts"),
    priceRange: { minVariantPrice: { amount: "34.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-himalayan-pink-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "34.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-dead-sea-mineral-bath-salts",
    title: "Dead Sea Mineral Bath Salts - 500g",
    description:
      "Authentic Dead Sea salt crystals rich in magnesium, potassium, and calcium. Blended with eucalyptus and peppermint essential oils to soothe tired muscles and promote recovery. Australian made.",
    descriptionHtml:
      "<p>Authentic <strong>Dead Sea salt crystals</strong> rich in magnesium, potassium, and calcium.</p><ul><li>Blended with eucalyptus and peppermint essential oils</li><li>Soothes tired muscles and promotes recovery</li><li>500g resealable kraft pouch</li><li>Australian made with pure ingredients</li></ul>",
    handle: "dead-sea-mineral-bath-salts-500g",
    availableForSale: true,
    productType: "Bath Salts",
    options: [{ id: "opt-2", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/bath-salts.jpg", "Dead Sea Mineral Bath Salts"),
    priceRange: { minVariantPrice: { amount: "39.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-dead-sea-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "39.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-coconut-coffee-body-scrub",
    title: "Coconut & Coffee Body Scrub - 250g",
    description:
      "Energising body scrub combining finely ground Arabica coffee with virgin coconut oil and raw sugar. Exfoliates dead skin cells, boosts circulation, and leaves skin silky smooth. No parabens, no sulphates.",
    descriptionHtml:
      "<p>Energising body scrub combining <strong>finely ground Arabica coffee</strong> with virgin coconut oil.</p><ul><li>Raw sugar for gentle exfoliation</li><li>Virgin coconut oil for deep moisture</li><li>Arabica coffee to boost circulation</li><li>250g amber glass jar</li><li>Handcrafted in Australia</li></ul>",
    handle: "coconut-coffee-body-scrub-250g",
    availableForSale: true,
    productType: "Body Scrub",
    options: [{ id: "opt-3", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/body-scrubs.jpg", "Coconut & Coffee Body Scrub"),
    priceRange: { minVariantPrice: { amount: "29.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-coconut-coffee-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "29.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-lemon-myrtle-body-scrub",
    title: "Lemon Myrtle Body Scrub - 250g",
    description:
      "Australian native lemon myrtle combined with sea salt and macadamia oil for a refreshing exfoliating scrub. The bright citrus scent uplifts while natural oils nourish and hydrate. Vegan and cruelty free.",
    descriptionHtml:
      "<p><strong>Australian native lemon myrtle</strong> combined with sea salt and macadamia oil.</p><ul><li>Sea salt for effective exfoliation</li><li>Cold-pressed macadamia oil for hydration</li><li>Native lemon myrtle essential oil</li><li>250g amber glass jar</li><li>Vegan and cruelty free</li></ul>",
    handle: "lemon-myrtle-body-scrub-250g",
    availableForSale: true,
    productType: "Body Scrub",
    options: [{ id: "opt-4", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/body-scrubs.jpg", "Lemon Myrtle Body Scrub"),
    priceRange: { minVariantPrice: { amount: "29.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-lemon-myrtle-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "29.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-lavender-essential-oil",
    title: "Lavender Essential Oil - 30ml",
    description:
      "Therapeutic-grade lavender essential oil sourced from Australian and French botanicals. Perfect for diffusing, bath soaks, and massage. Promotes relaxation and restful sleep. Pure steam-distilled, no synthetics.",
    descriptionHtml:
      "<p><strong>Therapeutic-grade lavender essential oil</strong> sourced from Australian and French botanicals.</p><ul><li>Pure steam-distilled extraction</li><li>30ml amber glass dropper bottle</li><li>Perfect for diffusers, baths, and massage</li><li>Promotes relaxation and restful sleep</li><li>No synthetics, no fillers</li></ul>",
    handle: "lavender-essential-oil-30ml",
    availableForSale: true,
    productType: "Essential Oil",
    options: [{ id: "opt-5", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/essential-oils.jpg", "Lavender Essential Oil"),
    priceRange: { minVariantPrice: { amount: "24.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-lavender-oil-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "24.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-eucalyptus-essential-oil",
    title: "Eucalyptus Essential Oil - 30ml",
    description:
      "Invigorating Australian eucalyptus essential oil, steam-distilled from native eucalyptus leaves. Ideal for clearing sinuses, refreshing living spaces, and adding to bath soaks. 100% pure and natural.",
    descriptionHtml:
      "<p><strong>Invigorating Australian eucalyptus essential oil</strong>, steam-distilled from native leaves.</p><ul><li>100% pure Australian eucalyptus</li><li>30ml amber glass dropper bottle</li><li>Ideal for diffusers and steam inhalation</li><li>Refreshing and clearing properties</li><li>No synthetics, no fillers</li></ul>",
    handle: "eucalyptus-essential-oil-30ml",
    availableForSale: true,
    productType: "Essential Oil",
    options: [{ id: "opt-6", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/essential-oils.jpg", "Eucalyptus Essential Oil"),
    priceRange: { minVariantPrice: { amount: "24.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-eucalyptus-oil-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "24.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-australian-native-soy-candle",
    title: "Australian Native Soy Candle - 300g",
    description:
      "Hand-poured 100% soy wax candle infused with native Australian botanicals including lemon myrtle and eucalyptus. Cotton wick for a clean, even burn. Approximately 45 hours burn time. Presented in a reusable amber glass vessel.",
    descriptionHtml:
      "<p><strong>Hand-poured 100% soy wax candle</strong> infused with native Australian botanicals.</p><ul><li>Lemon myrtle and eucalyptus essential oils</li><li>Cotton wick for clean, even burn</li><li>Approximately 45 hours burn time</li><li>300g reusable amber glass vessel</li><li>No toxins, no synthetic fragrances</li></ul>",
    handle: "australian-native-soy-candle-300g",
    availableForSale: true,
    productType: "Soy Candle",
    options: [{ id: "opt-7", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/candles.jpg", "Australian Native Soy Candle"),
    priceRange: { minVariantPrice: { amount: "44.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-native-candle-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "44.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-coastal-breeze-soy-candle",
    title: "Coastal Breeze Soy Candle - 300g",
    description:
      "Hand-poured soy wax candle with a fresh coastal scent of sea salt, driftwood, and light florals. Cotton wick for a clean burn. Approximately 45 hours burn time. Perfect for creating a relaxing coastal atmosphere at home.",
    descriptionHtml:
      "<p><strong>Hand-poured soy wax candle</strong> with a fresh coastal scent.</p><ul><li>Sea salt, driftwood, and light floral notes</li><li>Cotton wick for clean, even burn</li><li>Approximately 45 hours burn time</li><li>300g reusable amber glass vessel</li><li>No toxins, no synthetic fragrances</li></ul>",
    handle: "coastal-breeze-soy-candle-300g",
    availableForSale: true,
    productType: "Soy Candle",
    options: [{ id: "opt-8", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/collections/candles.jpg", "Coastal Breeze Soy Candle"),
    priceRange: { minVariantPrice: { amount: "44.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-coastal-candle-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "44.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-lemongrass-hand-wash",
    title: "Lemongrass Hand Wash - 500ml",
    description:
      "Gentle foaming hand wash with pure lemongrass essential oil and aloe vera. Cleanses without stripping natural moisture. Presented in a refillable amber glass pump bottle. Australian made, vegan, cruelty free.",
    descriptionHtml:
      "<p><strong>Gentle foaming hand wash</strong> with pure lemongrass essential oil and aloe vera.</p><ul><li>Lemongrass essential oil for natural freshness</li><li>Aloe vera and vitamin E for soft hands</li><li>500ml refillable amber glass pump bottle</li><li>Australian made, vegan, cruelty free</li><li>No parabens, no SLS, no synthetics</li></ul>",
    handle: "lemongrass-hand-wash-500ml",
    availableForSale: true,
    productType: "Hand Wash",
    options: [{ id: "opt-9", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/about-workshop.jpg", "Lemongrass Hand Wash"),
    priceRange: { minVariantPrice: { amount: "19.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-lemongrass-wash-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "19.95", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-tea-tree-hand-wash",
    title: "Tea Tree Hand Wash - 500ml",
    description:
      "Antibacterial hand wash powered by Australian tea tree essential oil with added moisturisers. Cleans and protects while keeping hands soft. Presented in a refillable amber glass pump bottle. Vegan and cruelty free.",
    descriptionHtml:
      "<p><strong>Antibacterial hand wash</strong> powered by Australian tea tree essential oil.</p><ul><li>Australian tea tree essential oil</li><li>Natural antibacterial properties</li><li>Added moisturisers for soft hands</li><li>500ml refillable amber glass pump bottle</li><li>Vegan and cruelty free</li></ul>",
    handle: "tea-tree-hand-wash-500ml",
    availableForSale: true,
    productType: "Hand Wash",
    options: [{ id: "opt-10", name: "Title", values: ["Default Title"] }],
    images: makeImages("/images/about-workshop.jpg", "Tea Tree Hand Wash"),
    priceRange: { minVariantPrice: { amount: "19.95", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-tea-tree-wash-1",
        title: "Default Title",
        availableForSale: true,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        price: { amount: "19.95", currencyCode: "AUD" },
      },
    ],
  },
]

export function getStaticProducts(): Product[] {
  return staticProducts
}

export function getStaticProduct(handle: string): Product | null {
  return staticProducts.find((p) => p.handle === handle) ?? null
}
