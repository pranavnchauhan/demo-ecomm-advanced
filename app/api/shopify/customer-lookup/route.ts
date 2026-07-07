import { NextResponse } from "next/server"
import { adminFetch } from "@/lib/shopify"

/**
 * POST /api/shopify/customer-lookup
 * Body: { email: string }
 * Returns: { hasOrders: boolean }
 *
 * Checks whether the email belongs to an existing customer via Shopify
 * paid orders. Used to validate WELCOME2PU eligibility (new customers only).
 * Kept server-side to protect the Admin API credentials.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

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
