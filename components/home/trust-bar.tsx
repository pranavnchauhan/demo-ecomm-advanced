import { Shield, Truck, Recycle, Sun, Award } from "lucide-react"

const BADGES = [
  { icon: Sun, label: "UV Protected" },
  { icon: Shield, label: "Weather Resistant" },
  { icon: Recycle, label: "Eco-Friendly" },
  { icon: Truck, label: "7-Day Delivery" },
  { icon: Award, label: "Quality Guaranteed" },
]

export function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-gray-600">
              <badge.icon className="w-5 h-5" style={{ color: '#2D6A4F' }} />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
