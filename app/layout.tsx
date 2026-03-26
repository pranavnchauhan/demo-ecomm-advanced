import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/cart/cart-context"
import { WishlistProvider } from "@/components/wishlist/wishlist-context"
import { CookieConsent } from "@/components/cookie-consent"
import { brand } from "@/config/brand"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] })
const _cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${brand.domain}`),
  title: {
    default: brand.seo.defaultTitle,
    template: brand.seo.titleTemplate,
  },
  description: brand.seo.defaultDescription,
  keywords: brand.seo.keywords,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: brand.name,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.seo.defaultDescription,
    images: [
      {
        url: brand.ogImage,
        width: 1200,
        height: 630,
        alt: `${brand.name} — ${brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.seo.defaultDescription,
    images: [brand.ogImage],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export const viewport: Viewport = {
  themeColor: brand.colors.primary,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

/* v4 - cart uses /api/cart route, checkout uses custom Stripe + Starshipit */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sameAs = [
    brand.social.instagram,
    brand.social.facebook,
    brand.social.tiktok,
    brand.social.pinterest,
  ].filter(Boolean)

  return (
    <html lang="en-AU">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": brand.name,
              "legalName": brand.legalName,
              "url": `https://www.${brand.domain}`,
              "logo": `https://www.${brand.domain}${brand.logo.default}`,
              "description": brand.seo.defaultDescription,
              "foundingDate": "2025",
              "areaServed": "AU",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": brand.supportEmail,
                "availableLanguage": "English"
              },
              "sameAs": sameAs
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": brand.name,
              "url": `https://www.${brand.domain}`,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `https://www.${brand.domain}/shop?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Google Consent Mode v2 — must run before GTM */}
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
// Restore consent if user previously accepted
if (typeof localStorage !== 'undefined' && localStorage.getItem('cookie_consent') === 'accepted') {
  gtag('consent', 'update', {
    'analytics_storage': 'granted',
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted'
  });
}`,
          }}
        />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="font-sans antialiased">
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        )}
        <CartProvider><WishlistProvider>{children}</WishlistProvider></CartProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
