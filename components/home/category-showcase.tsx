import Link from "next/link"
import Image from "next/image"
import { brand } from "@/config/brand"
import { ArrowRight } from "lucide-react"

export function CategoryShowcase() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-600">Find the perfect planter for every space</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {brand.collections.map((collection) => (
            <Link
              key={collection.handle}
              href={`/collections/${collection.handle}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200"
            >
              {collection.image && (
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg font-semibold">{collection.title}</h3>
                <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1 group-hover:text-white transition-colors">
                  Shop now <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
