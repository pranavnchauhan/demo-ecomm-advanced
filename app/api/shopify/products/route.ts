import { NextResponse } from "next/server"
import { shopifyAdminFetch } from "@/lib/shopify/admin"

// Get products from Admin API
export async function GET() {
  try {
    const data = await shopifyAdminFetch<{
      products: { edges: Array<{ node: { id: string; title: string; status: string; totalInventory: number } }> }
    }>({
      query: `
        query {
          products(first: 50) {
            edges {
              node {
                id
                title
                status
                totalInventory
                priceRangeV2 {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
    })

    return NextResponse.json({ products: (data?.products.edges ?? []).map((e: { node: unknown }) => e.node) })
  } catch (error) {
    console.error("Shopify products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// Update a product
export async function PUT(request: Request) {
  try {
    const { productId, input } = await request.json()

    const data = await shopifyAdminFetch({
      query: `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          id: productId,
          ...input,
        },
      },
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Shopify product update error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}
