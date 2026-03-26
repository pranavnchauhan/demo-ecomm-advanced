"use client"

import { useState, useMemo } from "react"
import type { ShopifyProduct, ShopifyCollection } from "@/lib/shopify/types"
import { ProductCard } from "@/components/products/product-card"
import { ShopSidebar, ShopToolbar, type FilterState } from "./shop-filters"
import { ShopListItem } from "./shop-list-item"

export function ShopPageWrapper({
  products,
  collections,
  ratingsMap,
}: {
  products: ShopifyProduct[]
  collections: ShopifyCollection[]
  ratingsMap: Map<string, { average: number; count: number }>
}) {
  const priceExtent = useMemo(() => {
    if (products.length === 0) return [0, 100] as [number, number]
    const prices = products.map((p) => parseFloat(p.priceRange.minVariantPrice.amount))
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] as [number, number]
  }, [products])

  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceRange: [priceExtent[0], priceExtent[1]],
    search: "",
    sort: "best-selling",
    viewMode: "grid",
  })

  function updateFilters(partial: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (filters.category) {
      result = result.filter((p) => p.productType === filters.category)
    }

    result = result.filter((p) => {
      const price = parseFloat(p.priceRange.minVariantPrice.amount)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q)
      )
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount))
        break
      case "price-desc":
        result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount))
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return result
  }, [products, filters])

  return (
    <div>
      <ShopToolbar
        filters={filters}
        onFilterChange={updateFilters}
        productCount={filteredProducts.length}
        totalCount={products.length}
      />

      <div className="flex gap-8">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden lg:block">
          <ShopSidebar
            products={products}
            filters={filters}
            onFilterChange={updateFilters}
          />
        </div>

        {/* Product grid/list */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products match your filters</p>
              <button
                onClick={() => setFilters({ category: null, priceRange: priceExtent, search: "", sort: "best-selling", viewMode: "grid" })}
                className="text-sm text-primary underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : filters.viewMode === "list" ? (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <ShopListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 4}
                  rating={ratingsMap.get(product.handle)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
