import Link from "next/link"
import { brand } from "@/config/brand"

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-xl font-semibold" style={{ color: '#2D6A4F' }}>
              {brand.name}
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              {brand.seo.defaultDescription}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {brand.collections.map((c) => (
                <li key={c.handle}>
                  <Link href={`/collections/${c.handle}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Help</h3>
            <ul className="space-y-2.5">
              <li><Link href="/policies/shipping" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Shipping</Link></li>
              <li><Link href="/policies/returns" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Returns</Link></li>
              <li><Link href="/policies/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Developed by{" "}
            <a href="https://krrispdigital.com.au" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
              Krrisp Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
