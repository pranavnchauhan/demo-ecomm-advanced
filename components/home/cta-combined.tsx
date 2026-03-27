import Link from "next/link"
import { brand } from "@/config/brand"

export function CtaCombined() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-12 lg:p-16 text-center text-white" style={{ backgroundColor: '#2D6A4F' }}>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-green-100 max-w-xl mx-auto mb-8">
            Browse our collection of premium fiber planters. Free shipping on orders over ${brand.shipping.freeThresholdDomestic}.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-800 font-semibold rounded-full hover:bg-green-50 transition-colors"
          >
            Shop All Planters
          </Link>
        </div>
      </div>
    </section>
  )
}
