import { NextResponse } from "next/server"
import { shopifyAdminFetch } from "@/lib/shopify/admin"

export async function GET() {
  try {
    const data = await shopifyAdminFetch<{
      orders: {
        edges: Array<{
          node: {
            id: string
            name: string
            createdAt: string
            totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
            displayFulfillmentStatus: string
            displayFinancialStatus: string
            customer: { firstName: string; lastName: string; email: string } | null
          }
        }>
      }
    }>({
      query: `
        query {
          orders(first: 50, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                id
                name
                createdAt
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                displayFulfillmentStatus
                displayFinancialStatus
                customer {
                  firstName
                  lastName
                  email
                }
              }
            }
          }
        }
      `,
    })

    return NextResponse.json({
      orders: (data?.orders.edges ?? []).map((e: { node: unknown }) => e.node),
    })
  } catch (error) {
    console.error("Shopify orders fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
