import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  try {
    const { amount, currency = "aud", email, name, metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    let customerId: string | undefined
    if (email) {
      const customer = await stripe.customers.create({ email, ...(name ? { name } : {}) })
      customerId = customer.id
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency,
      automatic_payment_methods: { enabled: true },
      ...(customerId ? { customer: customerId } : {}),
      ...(email ? { receipt_email: email } : {}),
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("[checkout] create-intent error:", error.message)
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
