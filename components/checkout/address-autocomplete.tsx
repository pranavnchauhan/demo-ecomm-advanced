"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Google Maps is loaded dynamically; declare types to satisfy TypeScript
declare const google: any
declare global { interface Window { google?: any } }

interface AddressResult {
  street: string
  city: string
  state: string
  postcode: string
  country_code: string
}

interface AddressAutocompleteProps {
  defaultValue?: string
  onSelect: (result: AddressResult) => void
  onManualChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  id?: string
}

// Track script loading globally to prevent duplicate script tags
let scriptLoadPromise: Promise<void> | null = null

function loadScript(apiKey: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise
  if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
    return Promise.resolve()
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptLoadPromise = null
      reject(new Error("Failed to load Google Maps"))
    }
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

// ── Demo mode addresses ────────────────────────────────────────────
const DEMO_ADDRESSES: { display: string; result: AddressResult }[] = [
  {
    display: "42 Wallaby Way, Sydney NSW 2000",
    result: { street: "42 Wallaby Way", city: "Sydney", state: "NSW", postcode: "2000", country_code: "AU" },
  },
  {
    display: "123 Collins Street, Melbourne VIC 3000",
    result: { street: "123 Collins Street", city: "Melbourne", state: "VIC", postcode: "3000", country_code: "AU" },
  },
  {
    display: "56 Queen Street, Brisbane QLD 4000",
    result: { street: "56 Queen Street", city: "Brisbane", state: "QLD", postcode: "4000", country_code: "AU" },
  },
  {
    display: "78 King William Street, Adelaide SA 5000",
    result: { street: "78 King William Street", city: "Adelaide", state: "SA", postcode: "5000", country_code: "AU" },
  },
]

export function AddressAutocomplete({
  defaultValue = "",
  onSelect,
  onManualChange,
  placeholder,
  required,
  id,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const onSelectRef = useRef(onSelect)
  const onManualChangeRef = useRef(onManualChange)
  const containerRef = useRef<HTMLDivElement>(null)

  // Demo mode state
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  const isDemoMode = !apiKey
  const [inputValue, setInputValue] = useState(defaultValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredAddresses, setFilteredAddresses] = useState(DEMO_ADDRESSES)

  // Keep callback refs up to date without re-triggering effects
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])
  useEffect(() => { onManualChangeRef.current = onManualChange }, [onManualChange])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDemoMode) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDemoMode])

  const initAutocomplete = useCallback(async () => {
    if (!apiKey || !inputRef.current || autocompleteRef.current) return

    try {
      await loadScript(apiKey)
    } catch {
      return // Silently fall back to plain input
    }

    if (!inputRef.current || autocompleteRef.current) return

    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["address_components", "formatted_address"],
    })

    ac.addListener("place_changed", () => {
      const place = ac.getPlace()
      if (!place.address_components) return

      const get = (type: string) =>
        place.address_components?.find((c: any) => c.types.includes(type))?.long_name || ""
      const getShort = (type: string) =>
        place.address_components?.find((c: any) => c.types.includes(type))?.short_name || ""

      const streetNumber = get("street_number")
      const route = get("route")

      onSelectRef.current({
        street: streetNumber ? `${streetNumber} ${route}` : route,
        city: get("locality") || get("sublocality_level_1") || get("postal_town"),
        state: getShort("administrative_area_level_1"),
        postcode: get("postal_code"),
        country_code: getShort("country"),
      })
    })

    autocompleteRef.current = ac
  }, [apiKey])

  useEffect(() => {
    if (!isDemoMode) {
      initAutocomplete()
    }
  }, [initAutocomplete, isDemoMode])

  // Demo mode: filter suggestions based on input
  function handleDemoInput(value: string) {
    setInputValue(value)
    onManualChangeRef.current?.(value)
    if (value.length >= 1) {
      const lower = value.toLowerCase()
      const filtered = DEMO_ADDRESSES.filter((a) =>
        a.display.toLowerCase().includes(lower)
      )
      setFilteredAddresses(filtered.length > 0 ? filtered : DEMO_ADDRESSES)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  function handleDemoSelect(addr: typeof DEMO_ADDRESSES[0]) {
    setInputValue(addr.display)
    setShowSuggestions(false)
    onSelectRef.current(addr.result)
  }

  // Demo mode rendering
  if (isDemoMode) {
    return (
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          required={required}
          value={inputValue}
          onChange={(e) => handleDemoInput(e.target.value)}
          onFocus={() => {
            if (inputValue.length >= 1) setShowSuggestions(true)
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-border bg-background shadow-lg">
            {filteredAddresses.map((addr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDemoSelect(addr)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-secondary transition-colors"
              >
                <svg className="h-4 w-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{addr.display}</span>
              </button>
            ))}
            {/* Powered by Google badge */}
            <div className="flex items-center justify-end border-t border-border px-3 py-1.5">
              <span className="text-[10px] text-muted-foreground/60">
                Powered by <span className="font-medium">Google</span>
              </span>
            </div>
          </div>
        )}

        {/* Subtle badge below input */}
        <div className="mt-1 flex justify-end">
          <span className="text-[10px] text-muted-foreground/40">
            Powered by Google
          </span>
        </div>
      </div>
    )
  }

  // Real Google Places mode
  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      required={required}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onBlur={(e) => onManualChangeRef.current?.(e.target.value)}
      autoComplete="off"
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    />
  )
}
