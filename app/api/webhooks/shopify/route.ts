import { NextResponse } from "next/server"

// Shopify webhook handler
// Handles: orders/create, orders/paid, checkouts/delete (abandoned)
// TODO: Wire order / abandoned-cart events to a CRM or email provider
// once one is configured for this project.
export async function POST(request: Request) {
  try {
    const topic = request.headers.get("x-shopify-topic")
    const body = await request.json()

    switch (topic) {
      case "orders/create":
      case "orders/paid": {
        const { customer, order_number } = body

        if (customer?.email) {
          console.log(`[webhooks/shopify] ${topic} received (no-op) for`, customer.email, "| order:", order_number)
        }
        break
      }

      case "checkouts/delete": {
        // Abandoned checkout
        const { email } = body

        if (email) {
          console.log("[webhooks/shopify] abandoned checkout received (no-op) for", email)
        }
        break
      }

      default:
        console.log(`Unhandled Shopify webhook topic: ${topic}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Shopify webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
