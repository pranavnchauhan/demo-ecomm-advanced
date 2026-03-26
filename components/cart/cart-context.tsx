"use client"

import React, { createContext, useContext } from "react"
import type { Product, ProductVariant, ShopifyCart } from "@/lib/shopify/types"
import { useCartState } from "@/hooks/use-cart"

// -----------------------------------------------------------------------
// CartContextType — kept stable so existing consumers need no changes.
//
// Mapping from useCartState names → context names:
//   isLoading        → isInitializing   (checkout-form.tsx depends on this)
//   updateQuantity   → updateItem       (cart-drawer.tsx depends on this)
//   operationInProgress                 (new — used by cart-drawer for
//                                        disabling buttons during API calls)
// -----------------------------------------------------------------------
type CartContextType = {
  cart: ShopifyCart | null
  isInitializing: boolean
  isOpen: boolean
  operationInProgress: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (variant: ProductVariant, product: Product) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const {
    cart,
    isLoading,
    isOpen,
    operationInProgress,
    itemCount,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  } = useCartState()

  const value: CartContextType = {
    cart,
    isInitializing: isLoading,
    isOpen,
    operationInProgress,
    itemCount,
    openCart,
    closeCart,
    addItem,
    updateItem: updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
