import { NextResponse } from "next/server"
import { adminFetch } from "@/lib/shopify"
import { getContactByEmail } from "@/lib/ghl"

/**
 * POST /api/shopify/customer-lookup
 * Body: { email: string }
 * Returns: { hasOrders: boolean }
 *
 * Checks whether the email belongs to an existing customer.
 * Validation order:
 *   1. GHL contact search — if contact has tag "lifecycle:customer" → reject
 *   2. Shopify paid orders fallback — if any paid orders exist → reject
 * Used to validate WELCOME2PU eligibility (new customers only).
 * Kept server-side to protect the Admin API credentials.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 1. Check GHL for existing customer tag
    try {
      const ghlResponse = await getContactByEmail(normalizedEmail) as any
      const contact = ghlResponse?.contact
      if (contact && Array.isArray(contact.tags) && contact.tags.includes("lifecycle:customer")) {
        console.log("[customer-lookup] GHL contact has lifecycle:customer tag — rejecting discount")
        return NextResponse.json({ hasOrders: true })
      }
    } catch (ghlError: any) {
      // GHL lookup failure is non-fatal — fall through to Shopify check
      console.warn("[customer-lookup] GHL lookup failed, falling through to Shopify:", ghlError.message)
    }

    // 2. Shopify paid orders fallback
    const result = await adminFetch<any>(
      `query OrderLookup($query: String!) {
        orders(first: 1, query: $query) {
          edges { node { id } }
        }
      }`,
      { query: `email:${normalizedEmail} financial_status:paid` }
    )

    const hasOrders = (result?.data?.orders?.edges?.length ?? 0) > 0
    return NextResponse.json({ hasOrders })
  } catch (error: any) {
    console.error("[customer-lookup] error:", error.message)
    // Fail closed — if lookup errors, deny the discount to protect against abuse
    return NextResponse.json({ hasOrders: true }, { status: 200 })
  }
}
