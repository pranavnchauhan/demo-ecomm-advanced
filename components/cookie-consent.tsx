"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

/** Push a Google Consent Mode v2 update to the dataLayer. */
function updateGoogleConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || []
  const state = granted ? "granted" : "denied"
  window.dataLayer.push({
    event: "consent_update",
    consent: "update",
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  } as Record<string, unknown>)
  // Also use the gtag consent API if available
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    })
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem("cookie_consent", "accepted")
    updateGoogleConsent(true)
    setVisible(false)
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined")
    updateGoogleConsent(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-secondary/95 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm leading-relaxed text-foreground/80">
          We use cookies to improve your experience. By continuing to use this site you accept our{" "}
          <Link
            href="/policies/privacy"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded border border-border px-4 py-2 font-sans text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded bg-primary px-4 py-2 font-sans text-xs tracking-wider uppercase text-primary-foreground transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
