import Link from "next/link"
import { Instagram } from "lucide-react"
import { brand } from "@/config/brand"

const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" },
  { href: "/quiz", label: "Quiz" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms", label: "Terms" },
]

const SOCIAL_LINKS = [
  ...(brand.social.instagram
    ? [{
        href: brand.social.instagram,
        label: "Instagram",
        icon: Instagram,
      }]
    : []),
  ...(brand.social.tiktok
    ? [{
        href: brand.social.tiktok,
        label: "TikTok",
        icon: () => (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        ),
      }]
    : []),
  ...(brand.social.facebook
    ? [{
        href: brand.social.facebook,
        label: "Facebook",
        icon: () => (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
      }]
    : []),
  ...(brand.social.pinterest
    ? [{
        href: brand.social.pinterest,
        label: "Pinterest",
        icon: () => (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/>
          </svg>
        ),
      }]
    : []),
]

export function SiteFooter() {
  return (
    <footer className="bg-secondary">
      {/* Main footer bar */}
      <div className="border-t border-border px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            {/* Left: Logo & tagline */}
            <div className="flex flex-col items-center lg:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo.default}
                alt={brand.name}
                width={120}
                height={30}
                className="h-6 w-auto"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {brand.tagline}
              </p>
            </div>

            {/* Centre: Links */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {brand.name}. Australian Made & Owned.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Developed by{" "}
            <a
              href="https://krrispdigital.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Krrisp Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
