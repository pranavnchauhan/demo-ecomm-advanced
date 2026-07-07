import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, cartId } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Log for now — integrate with a CRM or email service later
    console.log("[checkout] Abandoned cart email captured:", email, "cartId:", cartId)

    // TODO: Send to a CRM/email provider as an "abandoned_cart" contact
    // TODO: Or save to Supabase abandoned_carts table

    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ saved: false }, { status: 500 })
  }
}
