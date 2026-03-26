"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/shopify/types"
import { StarRating } from "./star-rating"
import type { JudgeMeRating } from "@/lib/judgeme"
import { COMING_SOON_HANDLES } from "@/lib/constants"

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(parseFloat(amount))
}

export function ProductCard({
  product,
  priority = false,
  isBestSeller = false,
  rating,
}: {
  product: Product
  priority?: boolean
  isBestSeller?: boolean
  rating?: JudgeMeRating
}) {
  const image = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const onSale =
    compareAt &&
    parseFloat(compareAt.amount) > 0 &&
    parseFloat(compareAt.amount) > parseFloat(price.amount)
  const isComingSoon = COMING_SOON_HANDLES.has(product.handle)

  return (
    <Link
      href={isComingSoon ? "#" : `/shop/${product.handle}`}
      className={`group flex flex-col ${isComingSoon ? "pointer-events-auto" : ""}`}
      onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-sans text-xs text-muted-foreground">No image</span>
          </div>
        )}
        {isComingSoon && (
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-primary text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase">
              Coming Soon
            </span>
          </div>
        )}
        {isBestSeller && !isComingSoon && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 font-sans text-[10px] tracking-[0.15em] uppercase text-primary-foreground rounded-full">
            Best Seller
          </span>
        )}
        {onSale && !isBestSeller && !isComingSoon && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-0.5 font-sans text-[10px] tracking-[0.2em] uppercase text-primary-foreground">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 pt-4">
        <h3 className="text-sm font-medium tracking-wide text-foreground">
          {product.title}
        </h3>
        {rating && rating.count > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating.average} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({rating.count})
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm text-muted-foreground">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {onSale && compareAt && (
            <span className="font-sans text-xs text-muted-foreground/40 line-through">
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
