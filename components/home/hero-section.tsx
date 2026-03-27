import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { brand } from "@/config/brand"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mb-6">
              New Collection 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Premium Fiber<br />
              <span style={{ color: '#2D6A4F' }}>Planters</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              {brand.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={brand.hero.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-medium rounded-full transition-colors"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                {brand.hero.ctaPrimary.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={brand.hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-500 transition-colors"
              >
                {brand.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-green-50">
              <Image
                src="/images/collections/indoor-pots.jpg"
                alt={`${brand.name} premium fiber planter collection`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating badges */}
            <div className="absolute -bottom-4 left-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#95D5B2' }}>
                <span className="text-lg">🌱</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">UV Protected</p>
                <p className="text-xs text-gray-500">Weather resistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
