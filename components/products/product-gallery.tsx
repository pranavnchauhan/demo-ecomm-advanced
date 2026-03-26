"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/shopify/types"

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.edges.map((e) => e.node).filter(img => img.url)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selectedImage = images[selectedIdx]

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-secondary">
        <p className="font-serif text-muted-foreground">No image available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f4f0]">
        {selectedImage && (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || product.title}
            fill
            className="object-contain p-4"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        )}
      </div>

      {/* Horizontal thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden bg-[#F5F0E8] transition-all ${
                idx === selectedIdx
                  ? "border-2 border-primary"
                  : "border border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${product.title} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
