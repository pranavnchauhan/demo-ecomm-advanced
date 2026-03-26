/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://maps.googleapis.com https://js.stripe.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://cdn.shopify.com https://*.myshopify.com https://*.public.blob.vercel-storage.com https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com https://www.facebook.com/tr",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.shopify.com https://*.supabase.co https://judge.me https://www.google-analytics.com https://maps.googleapis.com https://api.stripe.com https://*.stripe.network https://challenges.cloudflare.com https://va.vercel-scripts.com https://*.starshipit.com https://www.facebook.com https://connect.facebook.net",
              "frame-src https://www.googletagmanager.com https://challenges.cloudflare.com https://js.stripe.com https://www.facebook.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { dev }) => {
    if (dev && config.cache) {
      config.cache = {
        ...config.cache,
        type: 'filesystem',
        maxMemoryGenerations: 1,
      }
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.myshopify.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ljhcadlxpzbcizvlcrsu.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old /products/:handle to /shop/:handle
      {
        source: "/products/:handle",
        destination: "/shop/:handle",
        permanent: true,
      },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/our-story', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/faqs', destination: '/faq', permanent: true },
      { source: '/privacy-policy', destination: '/policies/privacy', permanent: true },
      { source: '/terms-of-use', destination: '/policies/terms', permanent: true },
      { source: '/login', destination: '/auth/login', permanent: true },
      { source: '/collection', destination: '/shop', permanent: true },
    ]
  },
}

export default nextConfig
