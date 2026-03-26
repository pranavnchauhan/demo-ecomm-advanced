"use client"

import { useWishlist } from "./wishlist-context"
import { X, Heart } from "lucide-react"
import Link from "next/link"

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, toggleItem, itemCount } = useWishlist()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={closeWishlist} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-serif flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wishlist ({itemCount})
          </h2>
          <button onClick={closeWishlist} className="p-2 hover:bg-muted rounded-full" aria-label="Close wishlist">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <Heart className="w-12 h-12" />
              <p>Your wishlist is empty</p>
              <Link href="/shop" onClick={closeWishlist} className="text-sm underline text-foreground">
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((handle) => (
                <li key={handle} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <Link
                    href={`/shop/${handle}`}
                    onClick={closeWishlist}
                    className="text-sm font-medium hover:underline capitalize"
                  >
                    {handle.replace(/-/g, " ")}
                  </Link>
                  <button
                    onClick={() => toggleItem(handle)}
                    className="text-muted-foreground hover:text-destructive p-1"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
