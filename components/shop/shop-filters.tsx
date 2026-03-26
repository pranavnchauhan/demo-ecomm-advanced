"use client"

import { useState, useMemo } from "react"
import type { ShopifyProduct, ShopifyCollection } from "@/lib/shopify/types"

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "title-asc", label: "Name A-Z" },
  { value: "title-desc", label: "Name Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export type FilterState = {
  category: string | null
  priceRange: [number, number]
  search: string
  sort: string
  viewMode: "grid" | "list"
}

export function ShopSidebar({
  products,
  filters,
  onFilterChange,
}: {
  products: ShopifyProduct[]
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
}) {
  // Calculate category counts from products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      const type = p.productType || "Other"
      counts[type] = (counts[type] || 0) + 1
    })
    return counts
  }, [products])

  const categories = Object.entries(categoryCounts).sort(([a], [b]) => a.localeCompare(b))

  // Calculate price range from products
  const priceExtent = useMemo(() => {
    if (products.length === 0) return [0, 100]
    const prices = products.map((p) => parseFloat(p.priceRange.minVariantPrice.amount))
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [products])

  return (
    <aside className="w-56 flex-shrink-0 space-y-6">
      <div className="sticky top-32 space-y-6">
        {/* Category filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Category</h3>
            {filters.category && (
              <button
                onClick={() => onFilterChange({ category: null })}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => onFilterChange({ category: null })}
                className={`text-sm w-full text-left py-1 flex items-center justify-between ${
                  !filters.category ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>All Categories</span>
                <span className="text-xs text-muted-foreground">{products.length}</span>
              </button>
            </li>
            {categories.map(([cat, count]) => (
              <li key={cat}>
                <button
                  onClick={() => onFilterChange({ category: cat })}
                  className={`text-sm w-full text-left py-1 flex items-center justify-between ${
                    filters.category === cat ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price range */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Price Range</h3>
          <div className="space-y-2">
            <input
              type="range"
              min={priceExtent[0]}
              max={priceExtent[1]}
              value={filters.priceRange[1]}
              onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
              className="w-full accent-primary"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function ShopToolbar({
  filters,
  onFilterChange,
  productCount,
  totalCount,
}: {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  productCount: number
  totalCount: number
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search products..."
          className="px-4 py-2 border border-border bg-background rounded-lg text-sm w-full sm:w-64 focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="border border-border bg-background px-3 py-2 text-sm rounded-lg focus:border-primary focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Grid/List toggle */}
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => onFilterChange({ viewMode: "grid" })}
            className={`p-2 ${filters.viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1"/>
              <rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/>
              <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
          </button>
          <button
            onClick={() => onFilterChange({ viewMode: "list" })}
            className={`p-2 ${filters.viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            aria-label="List view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="14" height="3" rx="1"/>
              <rect x="1" y="6" width="14" height="3" rx="1"/>
              <rect x="1" y="11" width="14" height="3" rx="1"/>
            </svg>
          </button>
        </div>

        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {productCount} of {totalCount} products
        </span>
      </div>
    </div>
  )
}
