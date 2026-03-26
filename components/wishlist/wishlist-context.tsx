"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

const WISHLIST_KEY = "ecomm_wishlist"

type WishlistContextType = {
  items: string[]
  isOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
  toggleItem: (handle: string) => void
  isInWishlist: (handle: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY)
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }, [items])

  const toggleItem = useCallback((handle: string) => {
    setItems((prev) =>
      prev.includes(handle)
        ? prev.filter((h) => h !== handle)
        : [...prev, handle]
    )
  }, [])

  const isInWishlist = useCallback((handle: string) => items.includes(handle), [items])

  return (
    <WishlistContext value={{
      items,
      isOpen,
      openWishlist: () => setIsOpen(true),
      closeWishlist: () => setIsOpen(false),
      toggleItem,
      isInWishlist,
      itemCount: items.length,
    }}>
      {children}
    </WishlistContext>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
