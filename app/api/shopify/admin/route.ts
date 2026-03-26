import { NextResponse } from "next/server"
import { shopifyAdminFetch } from "@/lib/shopify/admin"

// Generic proxy for Shopify Admin GraphQL
export async function POST(request: Request) {
  try {
    const { query, variables } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: "GraphQL query required" },
        { status: 400 }
      )
    }

    const data = await shopifyAdminFetch({ query, variables })
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Shopify Admin API error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Shopify Admin API request failed",
      },
      { status: 500 }
    )
  }
}
