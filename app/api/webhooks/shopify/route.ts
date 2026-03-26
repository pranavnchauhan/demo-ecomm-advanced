import { NextResponse } from "next/server"
import {
  createContact,
  addContactTag,
  addContactToWorkflow,
  createOpportunity,
  sendEmail,
} from "@/lib/ghl"

// Shopify webhook handler
// Handles: orders/create, orders/paid, checkouts/delete (abandoned)
export async function POST(request: Request) {
  try {
    const topic = request.headers.get("x-shopify-topic")
    const body = await request.json()

    switch (topic) {
      case "orders/create":
      case "orders/paid": {
        const { customer, total_price, order_number, line_items } = body

        if (customer?.email) {
          // Sync customer to GHL
          const ghlResult = await createContact({
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone,
            tags: ["customer", "purchased"],
          }) as { contact?: { id: string } }

          if (ghlResult?.contact?.id) {
            // Add purchase tags
            await addContactTag(ghlResult.contact.id, [
              "purchased",
              `order:${order_number}`,
            ])

            // Send order confirmation email via GHL
            const productNames = line_items
              ?.map((item: { title: string }) => item.title)
              .join(", ")

            await sendEmail({
              contactId: ghlResult.contact.id,
              subject: `Order #${order_number} Confirmed`,
              body: `Thank you for your order! You purchased: ${productNames}. Total: $${total_price}`,
            })
          }
        }
        break
      }

      case "checkouts/delete": {
        // Abandoned checkout - trigger recovery workflow
        const { email, abandoned_checkout_url } = body

        if (email) {
          const ghlResult = await createContact({
            email,
            tags: ["abandoned-cart"],
            customFields: [
              {
                key: "abandoned_checkout_url",
                value: abandoned_checkout_url || "",
              },
            ],
          }) as { contact?: { id: string } }

          if (ghlResult?.contact?.id) {
            await addContactTag(ghlResult.contact.id, ["abandoned-cart"])
            // Trigger abandoned cart workflow if workflow ID is configured
            // await addContactToWorkflow(ghlResult.contact.id, ABANDONED_CART_WORKFLOW_ID)
          }
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
