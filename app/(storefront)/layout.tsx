import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer"

// v2 layout
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <WishlistDrawer />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </>
  )
}
