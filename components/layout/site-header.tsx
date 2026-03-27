"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Menu, X, User } from "lucide-react"
import { brand } from "@/config/brand"
import { useCart } from "@/components/cart/cart-context"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { openCart, itemCount } = useCart()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-semibold" style={{ color: '#2D6A4F' }}>
                {brand.name}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">Home</Link>
              <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">Products</Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">About</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">Contact</Link>
            </nav>

            {/* Right: search + actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none w-40 lg:w-48"
                />
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-700 hover:text-green-700 transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center" style={{ width: '18px', height: '18px' }}>
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Sign In */}
              <Link
                href="/account"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-full transition-colors"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium text-gray-700">Home</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium text-gray-700">Products</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium text-gray-700">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium text-gray-700">Contact</Link>
              {/* Mobile search */}
              <div className="flex items-center bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200 mt-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
