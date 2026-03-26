import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, cartId } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Log for now — integrate with GHL or email service later
    console.log("[checkout] Abandoned cart email captured:", email, "cartId:", cartId)

    // TODO: Send to GHL as contact with "abandoned_cart" tag
    // TODO: Or save to Supabase abandoned_carts table

    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ saved: false }, { status: 500 })
  }
}
