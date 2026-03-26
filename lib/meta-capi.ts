/**
 * Meta Conversions API (CAPI) — Server-side event tracking
 *
 * Sends purchase/lead events directly to Meta's servers.
 * This catches conversions that browser-side pixel misses
 * (Safari ITP, ad blockers, slow connections).
 *
 * Pixel ID: 797355502875615
 */

import { createHash } from "crypto"

const PIXEL_ID = "797355502875615"
const META_API_VERSION = "v21.0"

function hashSHA256(value: string | undefined): string | undefined {
  if (!value) return undefined
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex")
}

interface CAPIUserData {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  fbp?: string // _fbp cookie
  fbc?: string // _fbc cookie
}

interface CAPICustomData {
  value?: number
  currency?: string
  contentType?: string
  contentIds?: string[]
  orderId?: string
}

interface CAPIEvent {
  eventName: string // Purchase, AddToCart, ViewContent, Lead, etc.
  eventTime: number // Unix timestamp
  userData: CAPIUserData
  customData?: CAPICustomData
  sourceUrl?: string
  eventId?: string // For deduplication with pixel
}

export async function sendMetaCAPI(event: CAPIEvent): Promise<void> {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN
  if (!accessToken) {
    console.warn("[meta-capi] No META_ADS_ACCESS_TOKEN configured, skipping")
    return
  }

  const userData: Record<string, any> = {}
  // Hash PII fields per Meta requirements
  if (event.userData.email) userData.em = [hashSHA256(event.userData.email)]
  if (event.userData.firstName) userData.fn = [hashSHA256(event.userData.firstName)]
  if (event.userData.lastName) userData.ln = [hashSHA256(event.userData.lastName)]
  if (event.userData.phone) userData.ph = [hashSHA256(event.userData.phone?.replace(/\D/g, ""))]
  if (event.userData.city) userData.ct = [hashSHA256(event.userData.city)]
  if (event.userData.state) userData.st = [hashSHA256(event.userData.state)]
  if (event.userData.zip) userData.zp = [hashSHA256(event.userData.zip)]
  if (event.userData.country) userData.country = [hashSHA256(event.userData.country)]
  // Browser identifiers (not hashed)
  if (event.userData.fbp) userData.fbp = event.userData.fbp
  if (event.userData.fbc) userData.fbc = event.userData.fbc

  const customData: Record<string, any> = {}
  if (event.customData?.value) customData.value = event.customData.value
  if (event.customData?.currency) customData.currency = event.customData.currency
  if (event.customData?.contentType) customData.content_type = event.customData.contentType
  if (event.customData?.contentIds) customData.content_ids = event.customData.contentIds
  if (event.customData?.orderId) customData.order_id = event.customData.orderId

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime,
        event_id: event.eventId || `${event.eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        event_source_url: event.sourceUrl || "https://www.saltandstone.com.au",
        action_source: "website",
        user_data: userData,
        custom_data: Object.keys(customData).length > 0 ? customData : undefined,
      },
    ],
  }

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Meta CAPI error ${res.status}: ${err}`)
  }

  const result = await res.json()
  console.log(`[meta-capi] ${event.eventName}: ${result.events_received} events received`)
}
