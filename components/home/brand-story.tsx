import Image from "next/image"
import { brand } from "@/config/brand"
import { Leaf, Recycle, Sun, Shield } from "lucide-react"

const FEATURES = [
  { icon: Leaf, title: "Premium Fiber", desc: "Lightweight yet incredibly strong" },
  { icon: Sun, title: "UV Protected", desc: "Colours stay vibrant year-round" },
  { icon: Shield, title: "Weather Resistant", desc: "Built for Australian conditions" },
  { icon: Recycle, title: "Eco-Friendly", desc: "100% recyclable material" },
]

export function BrandStory() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/images/collections/outdoor-planters.jpg"
              alt={`${brand.name} premium planter collection`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why {brand.name}?</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We started Terra Bloom because planters shouldn&apos;t compromise on beauty, durability, or sustainability. Our premium fiber material is lighter than ceramic, stronger than plastic, and better for the planet.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-green-50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2D6A4F' }}>
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
