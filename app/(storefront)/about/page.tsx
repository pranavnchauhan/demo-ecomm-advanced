import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Leaf, Sun, Shield, Recycle, ArrowRight } from "lucide-react"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: `Our Story | ${brand.name}`,
  description: `${brand.name} creates premium fiber planters for indoor and outdoor living. Lightweight, weather-resistant, UV-protected. Designed in Australia.`,
  alternates: {
    canonical: `https://www.${brand.domain}/about`,
  },
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-white px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Our Story</span>
          </nav>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Planters that grow<br />
            <span style={{ color: '#2D6A4F' }}>with you.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {brand.name} was founded on a simple idea: planters should be as beautiful as the plants they hold —
            without being heavy, fragile, or harmful to the environment. We design premium fiber planters that
            are lightweight, durable, and built for Australian conditions.
          </p>
        </div>
      </section>

      {/* Story + Image */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/images/collections/outdoor-planters.jpg"
              alt="Terra Bloom planters in an outdoor setting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why we started</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We were tired of the same old choices — ceramic pots that chip and crack, concrete planters
              too heavy to move, and plastic pots that fade in the sun and end up in landfill.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              So we set out to create something better. Our premium fiber material is the result of
              years of development — it looks and feels like stone or ceramic, but it&apos;s a fraction
              of the weight. It won&apos;t crack in frost, fade in UV, or deteriorate in rain.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every {brand.name} planter is designed in Australia, crafted from recyclable materials,
              and built to last for years — indoors or out. Because the best planter is one you
              never have to replace.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What makes us different</h2>
            <p className="text-gray-600">Premium materials, thoughtful design, sustainable practices</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#2D6A4F' }}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Fiber</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lightweight yet incredibly strong. Looks like ceramic, weighs like plastic, lasts like stone.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#2D6A4F' }}>
                <Sun className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">UV Protected</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Colours stay vibrant year-round, even in full Australian sun. No fading, no yellowing.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#2D6A4F' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Weather Resistant</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Built for Australian conditions. Won&apos;t crack in frost, warp in heat, or deteriorate in rain.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#2D6A4F' }}>
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                100% recyclable material. We&apos;re committed to reducing waste and building planters that last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Collections</h2>
          <p className="text-gray-600 mb-10">A planter for every space</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {brand.collections.map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
              >
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white text-xl font-semibold">{c.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{c.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-2 group-hover:text-white transition-colors">
                    Shop now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-gray-600">
            Not sure where to start?{" "}
            <Link href="/shop" className="font-medium hover:underline" style={{ color: '#2D6A4F' }}>Browse all planters</Link>{" "}
            or{" "}
            <Link href="/contact" className="font-medium hover:underline" style={{ color: '#2D6A4F' }}>get in touch</Link> for advice.
          </p>
        </div>
      </section>
    </main>
  )
}
