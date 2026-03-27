"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X, User } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useState, useEffect } from "react"
import { brand } from "@/config/brand"

const NAV_LEFT = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/collections/indoor-pots", label: "Indoor" },
]

const NAV_RIGHT = [
  { href: "/collections/outdoor-planters", label: "Outdoor" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const { openCart, itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background"
        }`}
      >
        {/* Top bar */}
        <Link href="/policies/shipping" className="block bg-primary px-4 py-2 text-center cursor-pointer">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary-foreground">
            {`FREE AU SHIPPING OVER $${brand.shipping.freeThresholdDomestic} | INTERNATIONAL OVER $${brand.shipping.freeThresholdInternational}`}
          </p>
        </Link>

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-12">
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Left nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-xs tracking-[0.2em] uppercase text-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Logo + tagline */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="font-serif text-2xl lg:text-3xl tracking-wide text-foreground">
              {brand.name}
            </span>
            <span className="mt-0.5 font-sans text-[8px] tracking-[0.15em] text-muted-foreground lg:text-[11px] lg:mt-1 lg:tracking-[0.2em]">
              {brand.tagline}
            </span>
          </Link>

          {/* Right nav + actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 lg:flex">
              {NAV_RIGHT.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-sans text-xs tracking-[0.2em] uppercase text-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/account"
              className="hidden text-foreground transition-colors hover:text-primary lg:block"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative text-foreground transition-colors hover:text-primary"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-primary font-sans text-[9px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background">
          <nav className="flex flex-col items-center gap-8">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="font-serif text-3xl tracking-wider text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="mt-4 font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground"
            >
              My Account
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
