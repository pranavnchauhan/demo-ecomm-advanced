"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Product, ProductVariant, ShopifyCart } from "@/lib/shopify/types"

export const CART_ID_KEY = "saltstone_cart_id"

// All cart ops go through the server API route so secrets stay server-side.
async function cartApi(
  body: Record<string, unknown>,
): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch {
    return { cart: null, error: "Network error" }
  }
}

export type CartState = {
  cart: ShopifyCart | null
  /** True while initCart or refreshCart is fetching. */
  isLoading: boolean
  isOpen: boolean
  /** True while any add/update/remove API call is in flight. */
  operationInProgress: boolean
  itemCount: number
  openCart: () => void
  closeCart: () => void
  addItem: (variant: ProductVariant, product: Product) => Promise<void>
  updateQuantity: (lineId: string, newQty: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
  /** Re-fetches the cart from Shopify. Call on checkout mount to ensure fresh data. */
  refreshCart: () => Promise<void>
}

export function useCartState(): CartState {
  const [cart, setCartRaw] = useState<ShopifyCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState(false)

  // Synchronous guard that prevents a second mutation from starting before the
  // first completes.  useState batches and schedules a re-render asynchronously,
  // so a rapid second click can slip through before the disabled state takes
  // effect in the DOM.  A ref mutates immediately and is checked synchronously
  // at the top of every mutation — the second call returns before any async
  // work begins.  The useState counterpart (operationInProgress) is still
  // needed to trigger the re-render that actually disables the buttons.
  const mutationLock = useRef(false)

  // Ref mirrors the state value so async callbacks always see the latest cart
  // without needing to be re-created on every render.
  const cartRef = useRef<ShopifyCart | null>(null)

  function setCart(next: ShopifyCart | null) {
    cartRef.current = next
    setCartRaw(next)
  }

  // ------------------------------------------------------------------
  // initCart — runs once on mount
  // Reads cartId from localStorage, fetches from Shopify, sets state.
  // An empty or invalid cart is treated as no cart (clears the stored ID).
  // ------------------------------------------------------------------
  useEffect(() => {
    async function initCart() {
      setIsLoading(true)

      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem(CART_ID_KEY)
          : null

      if (storedId) {
        const { cart: fetched } = await cartApi({
          action: "get",
          cartId: storedId,
        })

        if (fetched && fetched.lines.edges.length > 0) {
          setCart(fetched)
        } else {
          // Cart is empty or the ID is no longer valid on Shopify's side.
          localStorage.removeItem(CART_ID_KEY)
          setCart(null)
        }
      } else {
        setCart(null)
      }

      setIsLoading(false)
    }

    initCart()
  }, [])

  // ------------------------------------------------------------------
  // addItem
  // If a cart already exists, calls addLines.
  // Shopify's cartLinesAdd creates a new line per call even for the same
  // variant, so we check for an existing line first and increment via
  // updateLines instead to keep one line per variant.
  // If no cart yet, creates one and persists the new cart ID.
  // ------------------------------------------------------------------
  const addItem = useCallback(
    async (variant: ProductVariant, _product: Product) => {
      if (mutationLock.current) return
      mutationLock.current = true
      setOperationInProgress(true)
      try {
        const current = cartRef.current

        if (current?.id) {
          // Check for an existing line with this variant to avoid duplicates.
          const existingLine = current.lines.edges.find(
            (e) => e.node.merchandise.id === variant.id,
          )

          if (existingLine) {
            const { cart: updated } = await cartApi({
              action: "updateLines",
              cartId: current.id,
              lineId: existingLine.node.id,
              quantity: existingLine.node.quantity + 1,
            })
            if (updated) setCart(updated)
          } else {
            const { cart: updated } = await cartApi({
              action: "addLines",
              cartId: current.id,
              variantId: variant.id,
              quantity: 1,
            })
            if (updated) setCart(updated)
          }
        } else {
          // No cart yet — create one.
          const { cart: created } = await cartApi({
            action: "create",
            variantId: variant.id,
            quantity: 1,
          })
          if (created?.id) {
            localStorage.setItem(CART_ID_KEY, created.id)
            setCart(created)
          }
        }

        setIsOpen(true)
      } finally {
        mutationLock.current = false
        setOperationInProgress(false)
      }
    },
    [],
  )

  // ------------------------------------------------------------------
  // updateQuantity
  // newQty <= 0  → remove the line entirely
  // newQty > 0   → update to exact quantity
  // If the cart is left with 0 lines, clears the stored cart ID.
  // ------------------------------------------------------------------
  const updateQuantity = useCallback(
    async (lineId: string, newQty: number) => {
      if (mutationLock.current) return
      mutationLock.current = true
      setOperationInProgress(true)
      try {
        const current = cartRef.current
        if (!current?.id) return

        let updated: ShopifyCart | null = null

        if (newQty <= 0) {
          const result = await cartApi({
            action: "removeLines",
            cartId: current.id,
            lineId,
          })
          updated = result.cart
        } else {
          const result = await cartApi({
            action: "updateLines",
            cartId: current.id,
            lineId,
            quantity: newQty,
          })
          updated = result.cart
        }

        if (updated) {
          if (updated.lines.edges.length === 0) {
            localStorage.removeItem(CART_ID_KEY)
            setCart(null)
          } else {
            setCart(updated)
          }
        }
      } finally {
        mutationLock.current = false
        setOperationInProgress(false)
      }
    },
    [],
  )

  // ------------------------------------------------------------------
  // removeItem
  // Removes a single line by its Shopify line ID.
  // Clears the stored cart ID if the cart becomes empty.
  // ------------------------------------------------------------------
  const removeItem = useCallback(async (lineId: string) => {
    if (mutationLock.current) return
    mutationLock.current = true
    setOperationInProgress(true)
    try {
      const current = cartRef.current
      if (!current?.id) return

      const { cart: updated } = await cartApi({
        action: "removeLines",
        cartId: current.id,
        lineId,
      })

      if (updated) {
        if (updated.lines.edges.length === 0) {
          localStorage.removeItem(CART_ID_KEY)
          setCart(null)
        } else {
          setCart(updated)
        }
      }
    } finally {
      mutationLock.current = false
      setOperationInProgress(false)
    }
  }, [])

  // ------------------------------------------------------------------
  // refreshCart — re-fetches the cart from Shopify on demand.
  // Identical logic to initCart but callable by consumers (e.g. checkout
  // page on mount) to guarantee they always see current Shopify state
  // rather than potentially stale context from earlier in the session.
  // ------------------------------------------------------------------
  const refreshCart = useCallback(async () => {
    setIsLoading(true)
    const storedId =
      typeof window !== "undefined"
        ? localStorage.getItem(CART_ID_KEY)
        : null

    if (storedId) {
      const { cart: fetched } = await cartApi({
        action: "get",
        cartId: storedId,
      })
      if (fetched && fetched.lines.edges.length > 0) {
        setCart(fetched)
      } else {
        localStorage.removeItem(CART_ID_KEY)
        setCart(null)
      }
    } else {
      setCart(null)
    }
    setIsLoading(false)
  }, [])

  // ------------------------------------------------------------------
  // clearCart — local reset (e.g. after successful checkout)
  // ------------------------------------------------------------------
  const clearCart = useCallback(() => {
    setCart(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_ID_KEY)
    }
  }, [])

  const itemCount =
    cart?.lines.edges.reduce((acc, e) => acc + e.node.quantity, 0) ?? 0

  return {
    cart,
    isLoading,
    isOpen,
    operationInProgress,
    itemCount,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  }
}
