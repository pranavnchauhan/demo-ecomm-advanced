import { NextResponse } from "next/server"
import { getShippingRates } from "@/lib/starshipit"

export async function POST(request: Request) {
  try {
    const { destination, items, subtotal } = await request.json()

    if (!destination || !items) {
      return NextResponse.json(
        { error: "destination and items are required" },
        { status: 400 }
      )
    }

    const rates = await getShippingRates(destination, items, subtotal || 0)
    return NextResponse.json({ rates })
  } catch (error) {
    console.error("Shipping rates error:", error)
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    )
  }
}
