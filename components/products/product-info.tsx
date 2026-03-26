"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"
import type { Product, ProductVariant } from "@/lib/shopify/types"
import { ShoppingBag, Minus, Plus, Droplets, Sparkles, Leaf, Heart, Clock, ShieldCheck } from "lucide-react"
import { COMING_SOON_HANDLES } from "@/lib/constants"

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(parseFloat(amount))
}

// Body care trust badges — same for all products
const TRUST_BADGES = [
  { icon: "shield", label: "Australian Made" },
  { icon: "heart", label: "Cruelty Free" },
  { icon: "leaf", label: "100% Natural" },
  { icon: "sparkles", label: "Eco-Friendly" },
  { icon: "droplets", label: "Vegan" },
]

function getBadgeIcon(icon: string) {
  switch (icon) {
    case "shield": return ShieldCheck
    case "heart": return Heart
    case "leaf": return Leaf
    case "sparkles": return Sparkles
    case "droplets": return Droplets
    default: return Leaf
  }
}

// Shopify list metafields are stored as JSON-encoded arrays e.g. ["value1","value2"].
// Plain single_line_text_field values are just strings. Handle both.
function parseMetafieldText(value: string | null | undefined): string {
  if (!value) return ""
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.join(", ")
    if (typeof parsed === "string") return parsed
  } catch {
    // Not JSON — plain string, use as-is
  }
  return value
}

// Type guard: ensures a parsed how_to_use item has the required shape before use
function isHowToUseItem(item: unknown): item is { icon: string; title: string; text: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as Record<string, unknown>).title === "string" &&
    typeof (item as Record<string, unknown>).text === "string"
  )
}

function getIconComponent(icon: string) {
  switch (icon) {
    case "droplets": return Droplets
    case "sparkles": return Sparkles
    case "leaf": return Leaf
    case "heart": return Heart
    default: return Leaf
  }
}

export function ProductInfo({ product, allProducts = [] }: { product: Product; allProducts?: Product[] }) {
  const { addItem } = useCart()
  const [isAdding, startTransition] = useTransition()
  const [quantity, setQuantity] = useState(1)

  // Get selected variant (first available)
  const selectedVariant: ProductVariant | undefined = product.variants[0]
  const price = selectedVariant?.price || product.priceRange.minVariantPrice
  const handle = product.handle

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: price.currencyCode,
        value: parseFloat(price.amount),
        items: [
          {
            item_id: product.id.split("/").pop(),
            item_name: product.title,
            price: parseFloat(price.amount),
            quantity: 1,
          },
        ],
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  function handleAddToCart() {
    if (!selectedVariant) return
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: price.currencyCode,
        value: parseFloat(price.amount) * quantity,
        items: [
          {
            item_id: product.id.split("/").pop(),
            item_name: product.title,
            price: parseFloat(price.amount),
            quantity,
          },
        ],
      },
    })
    startTransition(async () => {
      for (let i = 0; i < quantity; i++) {
        await addItem(selectedVariant, product)
      }
    })
  }

  function decreaseQuantity() {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  function increaseQuantity() {
    setQuantity(quantity + 1)
  }

  // Use product description from Shopify, or metafields if available
  const categoryLabel = "Natural Body Care"
  const description = product.description || "Handcrafted with pure, natural ingredients. Australian made, cruelty free, and eco-friendly."

  const ingredients =
    parseMetafieldText(product.metafields?.ingredients) ||
    "See product label for full ingredients list."

  // How to use — from metafields or generic fallback
  let howToUse: { icon: string; title: string; text: string }[] = [
    { icon: "droplets", title: "Apply", text: "Use as directed on the product label" },
    { icon: "leaf", title: "Enjoy", text: "Incorporate into your daily self-care routine" },
  ]
  if (product.metafields?.how_to_use) {
    try {
      const parsed = JSON.parse(product.metafields.how_to_use)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isHowToUseItem)) {
        howToUse = parsed
      }
    } catch {
      // Malformed JSON — keep fallback
    }
  }

  return (
    <div className="flex flex-col">
      {/* Category label */}
      <p className="text-xs uppercase tracking-[0.3em] text-primary">
        {categoryLabel}
      </p>

      {/* Product title */}
      <h1 className="mt-3 font-serif text-2xl tracking-wide text-foreground md:text-3xl text-balance">
        {product.title}
      </h1>

      {/* Price */}
      <p className="mt-3 text-xl text-foreground">
        {formatPrice(price.amount, price.currencyCode)}
      </p>

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
        <div className="flex items-center border border-border rounded-md">
          <button
            onClick={decreaseQuantity}
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-foreground">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to bag button */}
      {COMING_SOON_HANDLES.has(product.handle) ? (
        <Button
          disabled
          className="mt-6 flex w-full items-center justify-center gap-2 bg-primary/80 py-6 text-sm uppercase tracking-widest text-primary-foreground rounded-md cursor-not-allowed"
        >
          <Clock className="h-4 w-4" />
          Coming Soon
        </Button>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={!product.availableForSale || !selectedVariant || isAdding}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-foreground py-6 text-sm uppercase tracking-widest text-primary-foreground hover:bg-foreground/90 rounded-md"
        >
          <ShoppingBag className="h-4 w-4" />
          {!product.availableForSale
            ? "Sold Out"
            : isAdding
              ? "Adding..."
              : "Add to Bag"}
        </Button>
      )}

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Trust badges — inline icons */}
      <div className="flex justify-between gap-3">
        {TRUST_BADGES.map((badge) => {
          const IconComponent = getBadgeIcon(badge.icon)
          return (
            <div key={badge.label} className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <span className="mt-1 text-[10px] text-muted-foreground text-center whitespace-nowrap">{badge.label}</span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Description */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Description
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Ingredients */}
      <div className="mt-6">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Ingredients
        </h3>
        <p className="text-sm text-foreground">
          {ingredients}
        </p>
      </div>

      {/* How to use */}
      <div className="mt-6">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          How to Use
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {howToUse.map((item, idx) => {
            const IconComponent = getIconComponent(item.icon)
            return (
              <div key={idx} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                <IconComponent className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Safety notice */}
      <div className="mt-6 p-4 bg-secondary rounded-md">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          For external use only. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.
        </p>
      </div>

      {/* Internal links */}
      <div className="mt-6">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Learn More
        </h3>
        <p className="text-sm text-muted-foreground">
          <Link href="/faq" className="text-primary underline-offset-2 hover:underline">FAQ</Link>{" | "}
          <Link href="/quiz" className="text-primary underline-offset-2 hover:underline">Find Your Ritual</Link>{" | "}
          <Link href="/shop" className="text-primary underline-offset-2 hover:underline">Browse All Products</Link>
        </p>
      </div>
    </div>
  )
}
