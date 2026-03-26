const STARSHIPIT_API_KEY = process.env.STARSHIPIT_API_KEY || ""
const STARSHIPIT_SUBSCRIPTION_KEY = process.env.STARSHIPIT_SUBSCRIPTION_KEY || ""
const STARSHIPIT_BASE_URL = "https://api.starshipit.com/api"

export interface ShippingAddress {
  street: string
  suburb: string
  city: string
  state: string
  postcode: string
  country_code: string
}

export interface ShippingRateItem {
  quantity: number
  weight: number // grams
  description: string
  sku?: string
}

export interface ShippingRate {
  service_name: string
  service_code: string
  carrier_name: string
  total_price: number
  currency: string
  estimated_days?: number
}

import { FREE_SHIPPING_AU, FREE_SHIPPING_INTL } from "@/lib/constants"
export { FREE_SHIPPING_AU as FREE_SHIPPING_THRESHOLD_AU, FREE_SHIPPING_INTL as FREE_SHIPPING_THRESHOLD_INTL } from "@/lib/constants"

export function getFreeShippingThreshold(countryCode: string): number {
  return countryCode === "AU" ? FREE_SHIPPING_AU : FREE_SHIPPING_INTL
}

export function qualifiesForFreeShipping(subtotalAud: number, countryCode: string): boolean {
  return subtotalAud >= getFreeShippingThreshold(countryCode)
}

export async function getShippingRates(
  destination: ShippingAddress,
  items: ShippingRateItem[],
  subtotalAud: number
): Promise<ShippingRate[]> {
  if (!STARSHIPIT_API_KEY) {
    console.error("[v0] Missing STARSHIPIT_API_KEY")
    return getFallbackRates()
  }

  console.log("[v0] Starshipit API key present:", STARSHIPIT_API_KEY.substring(0, 6) + "...")

  // If free shipping threshold met, return free option + express
  const freeShipping = qualifiesForFreeShipping(subtotalAud, destination.country_code)

  try {
    const requestBody = {
      destination: {
        street: destination.street,
        suburb: destination.suburb,
        city: destination.city,
        state: destination.state,
        post_code: destination.postcode,
        country_code: destination.country_code,
      },
      packages: items.map((item) => ({
        weight: item.weight / 1000, // API expects kg
        quantity: item.quantity,
      })),
    }

    console.log("[v0] Starshipit request:", JSON.stringify(requestBody))

    const res = await fetch(`${STARSHIPIT_BASE_URL}/rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "StarShipIT-Api-Key": STARSHIPIT_API_KEY,
        "Ocp-Apim-Subscription-Key": STARSHIPIT_SUBSCRIPTION_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error("[v0] Starshipit rates error:", res.status, body)
      return getFallbackRates(freeShipping)
    }

    const json = await res.json()
    console.log("[v0] Starshipit response:", JSON.stringify(json).substring(0, 500))

    if (!json.rates || json.rates.length === 0) {
      return getFallbackRates(freeShipping)
    }

    const rates: ShippingRate[] = json.rates.map((r: any) => ({
      service_name: r.service_name || r.service_type || "Standard",
      service_code: r.service_code || r.service_type || "standard",
      carrier_name: r.carrier_name || "Australia Post",
      total_price: r.total_price ?? r.price ?? 0,
      currency: "AUD",
      estimated_days: r.estimated_transit_time || undefined,
    }))

    // Sort by price ascending
    rates.sort((a, b) => a.total_price - b.total_price)

    // If free shipping qualifies, make the cheapest option free
    if (freeShipping && rates.length > 0) {
      rates[0] = {
        ...rates[0],
        service_name: `${rates[0].service_name} (FREE)`,
        total_price: 0,
      }
    }

    return rates
  } catch (error) {
    console.error("Starshipit fetch error:", error)
    return getFallbackRates(freeShipping)
  }
}

export interface StarshipitOrderItem {
  description: string
  qty: number
  price: number
  sku?: string
  weight: number // kg
}

export interface StarshipitOrderPayload {
  reference: string
  order_number: string
  shipping_method?: string
  email?: string
  order_date: string
  destination: {
    name: string
    street: string
    suburb: string
    city: string
    state: string
    postcode: string
    country: string
    phone?: string
    email?: string
  }
  items: StarshipitOrderItem[]
}

export async function pushOrderToStarshipit(order: StarshipitOrderPayload): Promise<boolean> {
  const endpoint = `${STARSHIPIT_BASE_URL}/orders`

  // Credential presence check (never log full key values)
  console.log("[starshipit] pushOrder — credential check:", {
    STARSHIPIT_API_KEY: STARSHIPIT_API_KEY ? `set (${STARSHIPIT_API_KEY.length} chars, starts ${STARSHIPIT_API_KEY.slice(0, 6)}…)` : "MISSING",
    STARSHIPIT_SUBSCRIPTION_KEY: STARSHIPIT_SUBSCRIPTION_KEY ? `set (${STARSHIPIT_SUBSCRIPTION_KEY.length} chars)` : "MISSING",
    endpoint,
  })

  if (!STARSHIPIT_API_KEY) {
    console.error("[starshipit] pushOrder aborted — STARSHIPIT_API_KEY is not set")
    return false
  }

  const payload = { order }
  console.log("[starshipit] pushOrder payload:", JSON.stringify(payload))

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "starshipit-api-key": STARSHIPIT_API_KEY,
        "Ocp-Apim-Subscription-Key": STARSHIPIT_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const responseText = await res.text()
    console.log("[starshipit] pushOrder response:", res.status, res.statusText, responseText)

    if (!res.ok) {
      console.error("[starshipit] pushOrder FAILED — status:", res.status, "body:", responseText)
      return false
    }

    let json: any
    try {
      json = JSON.parse(responseText)
    } catch {
      console.error("[starshipit] pushOrder — response is not JSON:", responseText)
      return false
    }

    console.log("[starshipit] pushOrder SUCCESS — order_id:", json?.order?.order_id ?? "(no id in response)")
    return true
  } catch (error) {
    console.error("[starshipit] pushOrder exception (network/timeout):", error)
    return false
  }
}

function getFallbackRates(freeShipping = false): ShippingRate[] {
  return [
    {
      service_name: freeShipping ? "FREE Standard Shipping" : "Standard Shipping",
      service_code: "standard",
      carrier_name: "Australia Post",
      total_price: freeShipping ? 0 : 9.95,
      currency: "AUD",
      estimated_days: 5,
    },
    {
      service_name: "Express Shipping",
      service_code: "express",
      carrier_name: "Australia Post",
      total_price: 14.95,
      currency: "AUD",
      estimated_days: 2,
    },
  ]
}
