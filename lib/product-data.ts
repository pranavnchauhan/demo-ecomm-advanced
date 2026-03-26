import type { Product } from "@/lib/shopify/types"

/**
 * Static product data for Terra Bloom demo.
 * Used as fallback when no Shopify store is connected.
 */

function makeImages(imagePath: string, productName: string) {
  return {
    edges: [
      {
        node: {
          url: imagePath,
          altText: `${productName} - Terra Bloom`,
        },
      },
    ],
  }
}

export const staticProducts: Product[] = [
  {
    id: "static-apple-shape-pot",
    title: "Apple Shape Pot",
    description:
      "A beautifully rounded fiber planter inspired by the classic apple silhouette. Lightweight yet sturdy, perfect for medium houseplants like monsteras and peace lilies. Available in multiple colours and sizes to suit any interior.",
    descriptionHtml:
      "<p>A beautifully rounded <strong>fiber planter</strong> inspired by the classic apple silhouette.</p><ul><li>Premium fiber material — lightweight yet sturdy</li><li>Perfect for medium houseplants</li><li>UV-protected finish</li><li>Available in Small and Medium</li><li>Drainage hole included</li></ul>",
    handle: "apple-shape-pot",
    availableForSale: true,
    productType: "Indoor Pots",
    options: [
      { id: "opt-1a", name: "Color", values: ["White", "Grey", "Charcoal", "Natural"] },
      { id: "opt-1b", name: "Size", values: ["Small", "Medium"] },
    ],
    images: makeImages("/images/products/apple-shape-pot.jpg", "Apple Shape Pot"),
    priceRange: { minVariantPrice: { amount: "89.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-apple-white-sm",
        title: "White / Small",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "White" },
          { name: "Size", value: "Small" },
        ],
        price: { amount: "89.00", currencyCode: "AUD" },
      },
      {
        id: "var-apple-white-md",
        title: "White / Medium",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "White" },
          { name: "Size", value: "Medium" },
        ],
        price: { amount: "109.00", currencyCode: "AUD" },
      },
      {
        id: "var-apple-grey-sm",
        title: "Grey / Small",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Grey" },
          { name: "Size", value: "Small" },
        ],
        price: { amount: "89.00", currencyCode: "AUD" },
      },
      {
        id: "var-apple-charcoal-sm",
        title: "Charcoal / Small",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Charcoal" },
          { name: "Size", value: "Small" },
        ],
        price: { amount: "89.00", currencyCode: "AUD" },
      },
      {
        id: "var-apple-natural-sm",
        title: "Natural / Small",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Natural" },
          { name: "Size", value: "Small" },
        ],
        price: { amount: "89.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-ball-shape-pot",
    title: "Ball Shape Pot",
    description:
      "A perfectly spherical fiber planter that works indoors and outdoors. The smooth, minimalist form complements any decor style. Weather-resistant and UV-protected for year-round use.",
    descriptionHtml:
      "<p>A perfectly spherical <strong>fiber planter</strong> that works indoors and outdoors.</p><ul><li>Smooth minimalist design</li><li>Weather-resistant and UV-protected</li><li>Suitable for indoor and outdoor use</li><li>Drainage hole included</li><li>Lightweight fiber construction</li></ul>",
    handle: "ball-shape-pot",
    availableForSale: true,
    productType: "Indoor Pots",
    options: [
      { id: "opt-2a", name: "Color", values: ["White", "Charcoal", "Black"] },
    ],
    images: makeImages("/images/products/ball-shape-pot.jpg", "Ball Shape Pot"),
    priceRange: { minVariantPrice: { amount: "79.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-ball-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "79.00", currencyCode: "AUD" },
      },
      {
        id: "var-ball-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "79.00", currencyCode: "AUD" },
      },
      {
        id: "var-ball-black",
        title: "Black",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Black" }],
        price: { amount: "79.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-bowl-shape-fiber-pot",
    title: "Bowl Shape Fiber Pot",
    description:
      "A low-profile round fiber pot ideal for tabletop displays. Perfect for succulents, small herbs, and decorative arrangements. Clean lines and a natural feel make it a versatile addition to any surface.",
    descriptionHtml:
      "<p>A low-profile round <strong>fiber pot</strong> ideal for tabletop displays.</p><ul><li>Perfect for succulents and small herbs</li><li>Round bowl shape</li><li>Lightweight and easy to move</li><li>Natural matte finish</li><li>Drainage hole included</li></ul>",
    handle: "bowl-shape-fiber-pot",
    availableForSale: true,
    productType: "Tabletop",
    options: [
      { id: "opt-3a", name: "Color", values: ["White", "Grey", "Natural"] },
    ],
    images: makeImages("/images/products/bowl-shape-fiber-pot.jpg", "Bowl Shape Fiber Pot"),
    priceRange: { minVariantPrice: { amount: "49.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-bowl-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "49.00", currencyCode: "AUD" },
      },
      {
        id: "var-bowl-grey",
        title: "Grey",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Grey" }],
        price: { amount: "49.00", currencyCode: "AUD" },
      },
      {
        id: "var-bowl-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "49.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-tall-square-planter",
    title: "Tall Square Planter",
    description:
      "A sleek, tall square planter built for outdoor use. Perfect for flanking doorways, lining patios, or creating garden borders. UV-protected and weather-resistant fiber construction stands up to the harshest Australian conditions.",
    descriptionHtml:
      "<p>A sleek, tall square <strong>outdoor planter</strong> built for the elements.</p><ul><li>UV-protected fiber material</li><li>Weather-resistant construction</li><li>Perfect for doorways and patios</li><li>Drainage hole included</li><li>Lightweight — easy to reposition</li></ul>",
    handle: "tall-square-planter",
    availableForSale: true,
    productType: "Outdoor Planters",
    options: [
      { id: "opt-4a", name: "Color", values: ["Charcoal", "White"] },
    ],
    images: makeImages("/images/products/tall-square-planter.jpg", "Tall Square Planter"),
    priceRange: { minVariantPrice: { amount: "149.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "179.00", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-tallsq-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "149.00", currencyCode: "AUD" },
      },
      {
        id: "var-tallsq-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "149.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-big-cylindrical-fiber-planter",
    title: "Big Cylindrical Fiber Planter",
    description:
      "A large cylindrical planter designed for feature plants and indoor trees. The generous proportions make it the centrepiece of any room or outdoor space. Premium fiber construction keeps it lightweight despite its impressive size.",
    descriptionHtml:
      "<p>A large cylindrical <strong>fiber planter</strong> designed for feature plants and indoor trees.</p><ul><li>Generous proportions for large plants</li><li>Premium fiber — lighter than concrete or ceramic</li><li>UV-protected for outdoor use</li><li>Drainage hole included</li><li>Statement piece for any space</li></ul>",
    handle: "big-cylindrical-fiber-planter",
    availableForSale: true,
    productType: "Large Planters",
    options: [
      { id: "opt-5a", name: "Color", values: ["Grey", "Charcoal", "Natural"] },
    ],
    images: makeImages("/images/products/big-cylindrical-fiber-planter.jpg", "Big Cylindrical Fiber Planter"),
    priceRange: { minVariantPrice: { amount: "249.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "299.00", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-bigcyl-grey",
        title: "Grey",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Grey" }],
        price: { amount: "249.00", currencyCode: "AUD" },
      },
      {
        id: "var-bigcyl-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "249.00", currencyCode: "AUD" },
      },
      {
        id: "var-bigcyl-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "249.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-flare-round-planter",
    title: "Flare Round Planter",
    description:
      "An elegant flared round planter with a wide opening that tapers to a stable base. Ideal for large feature plants, fiddle leaf figs, and bird of paradise. The generous width allows root systems to spread naturally.",
    descriptionHtml:
      "<p>An elegant <strong>flared round planter</strong> with a wide opening tapering to a stable base.</p><ul><li>Wide opening for large feature plants</li><li>Tapered base for stability</li><li>Premium fiber — lighter than stone</li><li>UV-protected and weather-resistant</li><li>Drainage hole included</li></ul>",
    handle: "flare-round-planter",
    availableForSale: true,
    productType: "Large Planters",
    options: [
      { id: "opt-6a", name: "Color", values: ["Natural", "Charcoal"] },
    ],
    images: makeImages("/images/products/flare-round-planter.jpg", "Flare Round Planter"),
    priceRange: { minVariantPrice: { amount: "269.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "319.00", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-flare-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "269.00", currencyCode: "AUD" },
      },
      {
        id: "var-flare-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "269.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-classic-curve-fiber-pot",
    title: "Classic Curve Fiber Pot",
    description:
      "A timeless curved planter that blends seamlessly into any setting. The gentle curves and smooth matte finish give it a modern yet organic feel. Suitable for both indoor and outdoor use with UV protection.",
    descriptionHtml:
      "<p>A timeless <strong>curved fiber planter</strong> that blends seamlessly into any setting.</p><ul><li>Gentle curves with smooth matte finish</li><li>Indoor and outdoor suitable</li><li>UV-protected fiber material</li><li>Drainage hole included</li><li>Available in three classic colours</li></ul>",
    handle: "classic-curve-fiber-pot",
    availableForSale: true,
    productType: "Indoor Pots",
    options: [
      { id: "opt-7a", name: "Color", values: ["White", "Grey", "Charcoal"] },
    ],
    images: makeImages("/images/products/classic-curve-fiber-pot.jpg", "Classic Curve Fiber Pot"),
    priceRange: { minVariantPrice: { amount: "119.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-curve-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "119.00", currencyCode: "AUD" },
      },
      {
        id: "var-curve-grey",
        title: "Grey",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Grey" }],
        price: { amount: "119.00", currencyCode: "AUD" },
      },
      {
        id: "var-curve-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "119.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-cone-shaped-planter",
    title: "Cone Shaped Planter",
    description:
      "A modern cone-shaped planter with a wide top and tapered base. The geometric silhouette adds a contemporary edge to any room. Lightweight fiber construction makes it easy to move and rearrange.",
    descriptionHtml:
      "<p>A modern <strong>cone-shaped planter</strong> with a wide top and tapered base.</p><ul><li>Contemporary geometric design</li><li>Lightweight fiber construction</li><li>Perfect for medium houseplants</li><li>Matte finish in soft tones</li><li>Drainage hole included</li></ul>",
    handle: "cone-shaped-planter",
    availableForSale: true,
    productType: "Indoor Pots",
    options: [
      { id: "opt-8a", name: "Color", values: ["White", "Natural", "Sage"] },
    ],
    images: makeImages("/images/products/cone-shaped-planter.jpg", "Cone Shaped Planter"),
    priceRange: { minVariantPrice: { amount: "69.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-cone-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "69.00", currencyCode: "AUD" },
      },
      {
        id: "var-cone-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "69.00", currencyCode: "AUD" },
      },
      {
        id: "var-cone-sage",
        title: "Sage",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Sage" }],
        price: { amount: "69.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-hanging-macrame-pot",
    title: "Hanging Macrame Pot",
    description:
      "A fiber pot paired with a handcrafted macrame hanger. Perfect for trailing plants like pothos, string of pearls, and ivy. The natural macrame rope adds a bohemian touch to balconies, verandahs, and indoor spaces.",
    descriptionHtml:
      "<p>A fiber pot paired with a <strong>handcrafted macrame hanger</strong>.</p><ul><li>Includes fiber pot and macrame rope</li><li>Perfect for trailing plants</li><li>Natural bohemian aesthetic</li><li>Suitable for indoor and sheltered outdoor use</li><li>Drainage hole included</li></ul>",
    handle: "hanging-macrame-pot",
    availableForSale: true,
    productType: "Hanging Pots",
    options: [
      { id: "opt-9a", name: "Color", values: ["Natural", "Black"] },
    ],
    images: makeImages("/images/products/hanging-macrame-pot.jpg", "Hanging Macrame Pot"),
    priceRange: { minVariantPrice: { amount: "59.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-macrame-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "59.00", currencyCode: "AUD" },
      },
      {
        id: "var-macrame-black",
        title: "Black",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Black" }],
        price: { amount: "59.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-ribbed-cylinder-pot",
    title: "Ribbed Cylinder Pot",
    description:
      "A textured cylindrical planter with vertical ribbing that adds depth and character. The ribbed pattern catches light beautifully, creating subtle shadows throughout the day. A standout piece for any indoor plant collection.",
    descriptionHtml:
      "<p>A textured <strong>cylindrical planter</strong> with vertical ribbing for depth and character.</p><ul><li>Vertical ribbed texture</li><li>Catches light for subtle shadow play</li><li>Premium fiber material</li><li>Suitable for medium houseplants</li><li>Drainage hole included</li></ul>",
    handle: "ribbed-cylinder-pot",
    availableForSale: true,
    productType: "Indoor Pots",
    options: [
      { id: "opt-10a", name: "Color", values: ["White", "Charcoal", "Terracotta"] },
    ],
    images: makeImages("/images/products/ribbed-cylinder-pot.jpg", "Ribbed Cylinder Pot"),
    priceRange: { minVariantPrice: { amount: "99.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-ribbed-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "99.00", currencyCode: "AUD" },
      },
      {
        id: "var-ribbed-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "99.00", currencyCode: "AUD" },
      },
      {
        id: "var-ribbed-terracotta",
        title: "Terracotta",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Terracotta" }],
        price: { amount: "99.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-low-wide-bowl",
    title: "Low Wide Bowl",
    description:
      "A wide, shallow fiber bowl perfect for succulent arrangements, herb gardens, and centrepiece displays. The low profile keeps the focus on your plants. Ideal for tabletops, windowsills, and dining tables.",
    descriptionHtml:
      "<p>A wide, shallow <strong>fiber bowl</strong> perfect for succulent arrangements and centrepiece displays.</p><ul><li>Wide shallow profile</li><li>Ideal for succulents and herb gardens</li><li>Perfect tabletop centrepiece</li><li>Lightweight fiber material</li><li>Drainage hole included</li></ul>",
    handle: "low-wide-bowl",
    availableForSale: true,
    productType: "Tabletop",
    options: [
      { id: "opt-11a", name: "Color", values: ["White", "Grey", "Natural"] },
    ],
    images: makeImages("/images/products/low-wide-bowl.jpg", "Low Wide Bowl"),
    priceRange: { minVariantPrice: { amount: "39.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-lowbowl-white",
        title: "White",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        price: { amount: "39.00", currencyCode: "AUD" },
      },
      {
        id: "var-lowbowl-grey",
        title: "Grey",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Grey" }],
        price: { amount: "39.00", currencyCode: "AUD" },
      },
      {
        id: "var-lowbowl-natural",
        title: "Natural",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Natural" }],
        price: { amount: "39.00", currencyCode: "AUD" },
      },
    ],
  },
  {
    id: "static-textured-stone-pot",
    title: "Textured Stone Pot",
    description:
      "A fiber planter with a realistic stone texture finish. Looks and feels like natural stone but weighs a fraction of the real thing. Built for outdoor use with full UV protection and weather resistance.",
    descriptionHtml:
      "<p>A fiber planter with a realistic <strong>stone texture finish</strong>.</p><ul><li>Realistic stone-look surface</li><li>Fraction of the weight of real stone</li><li>Full UV protection</li><li>Weather-resistant for outdoor use</li><li>Drainage hole included</li></ul>",
    handle: "textured-stone-pot",
    availableForSale: true,
    productType: "Outdoor Planters",
    options: [
      { id: "opt-12a", name: "Color", values: ["Sandstone", "Charcoal"] },
    ],
    images: makeImages("/images/products/textured-stone-pot.jpg", "Textured Stone Pot"),
    priceRange: { minVariantPrice: { amount: "159.00", currencyCode: "AUD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "0", currencyCode: "AUD" } },
    variants: [
      {
        id: "var-stone-sandstone",
        title: "Sandstone",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Sandstone" }],
        price: { amount: "159.00", currencyCode: "AUD" },
      },
      {
        id: "var-stone-charcoal",
        title: "Charcoal",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        price: { amount: "159.00", currencyCode: "AUD" },
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Collection mapping — maps collection handles to product types or filters
// ---------------------------------------------------------------------------

const COLLECTION_MAP: Record<string, (p: Product) => boolean> = {
  "indoor-pots": (p) => p.productType === "Indoor Pots",
  "outdoor-planters": (p) => p.productType === "Outdoor Planters",
  "hanging-pots": (p) => p.productType === "Hanging Pots",
  "tabletop": (p) => p.productType === "Tabletop",
  "large-planters": (p) => p.productType === "Large Planters",
  "sale": (p) =>
    parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? "0") > 0,
  "new-arrivals": (p) => staticProducts.indexOf(p) < 6,
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export function getStaticProducts(): Product[] {
  return staticProducts
}

export function getStaticProduct(handle: string): Product | null {
  return staticProducts.find((p) => p.handle === handle) ?? null
}

export function getStaticProductsByType(productType: string): Product[] {
  return staticProducts.filter((p) => p.productType === productType)
}

export function getStaticCollectionProducts(collectionHandle: string): Product[] {
  const filterFn = COLLECTION_MAP[collectionHandle]
  if (!filterFn) return []
  return staticProducts.filter(filterFn)
}
