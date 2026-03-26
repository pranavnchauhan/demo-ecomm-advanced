import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { adminFetch } from "@/lib/shopify"
import { pushOrderToStarshipit } from "@/lib/starshipit"
import { sendMetaCAPI } from "@/lib/meta-capi"

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  try {
    const { paymentIntentId, shippingAddress, lineItems, shippingRate, discountCode } =
      await request.json()

    // Verify payment succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      )
    }

    const email = shippingAddress?.email || ""
    const firstName = shippingAddress?.firstName || ""
    const lastName = shippingAddress?.lastName || ""
    const fullName = [firstName, lastName].filter(Boolean).join(" ")

    // Step 1: Create draft order in Shopify
    const createMutation = `
      mutation DraftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder { id name }
          userErrors { field message }
        }
      }
    `
    const createVariables = {
      input: {
        email,
        lineItems: (lineItems || []).map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          originalUnitPrice: String(item.price),
          ...(item.variantId ? { variantId: item.variantId } : {}),
        })),
        shippingAddress: {
          firstName,
          lastName,
          address1: shippingAddress?.street || '',
          city: shippingAddress?.city || '',
          provinceCode: shippingAddress?.state || '',
          zip: shippingAddress?.postcode || '',
          countryCode: 'AU',
        },
        ...(shippingRate ? {
          shippingLine: {
            title: shippingRate.service_name,
            price: String(shippingRate.total_price),
          }
        } : {}),
        note: `Stripe Payment: ${paymentIntentId}${discountCode ? ` | Discount: ${discountCode}` : ""}`,
        ...(discountCode === "WELCOME2PU" ? {
          appliedDiscount: {
            description: "New customer welcome discount",
            value: 10.0,
            valueType: "PERCENTAGE",
            title: "WELCOME2PU",
          },
        } : {}),
      }
    }
    const createResult = await adminFetch<any>(createMutation, createVariables)
    const draftOrderId = createResult?.data?.draftOrderCreate?.draftOrder?.id
    const draftOrderName = createResult?.data?.draftOrderCreate?.draftOrder?.name

    if (!draftOrderId) {
      const errors = createResult?.data?.draftOrderCreate?.userErrors
      console.error("[checkout] draftOrderCreate errors:", errors)
      return NextResponse.json({ success: true, warning: "Draft order creation failed" })
    }

    // Step 2: Complete the draft order → converts to a paid confirmed order
    const completeMutation = `
      mutation DraftOrderComplete($id: ID!) {
        draftOrderComplete(id: $id, paymentPending: false) {
          draftOrder {
            order { id name }
          }
          userErrors { field message }
        }
      }
    `
    const completeResult = await adminFetch<any>(completeMutation, { id: draftOrderId })
    const orderName = completeResult?.data?.draftOrderComplete?.draftOrder?.order?.name
    if (orderName) {
      console.log("[checkout] Order created:", orderName)
    } else {
      const errors = completeResult?.data?.draftOrderComplete?.userErrors
      console.error("[checkout] draftOrderComplete errors:", errors)
    }

    // Step 3: Push order directly to Starshipit (don't rely on Shopify webhook)
    const orderRef = orderName || draftOrderName || paymentIntentId
    try {
      console.log('[starshipit] Calling push for order:', orderRef)
      const result = await pushOrderToStarshipit({
        reference: orderRef,
        order_number: orderRef,
        shipping_method: shippingRate?.service_name || "Standard",
        email,
        order_date: new Date().toISOString(),
        destination: {
          name: fullName || email,
          street: [shippingAddress?.street, shippingAddress?.apartment].filter(Boolean).join(", "),
          suburb: shippingAddress?.city || "",
          city: shippingAddress?.city || "",
          state: shippingAddress?.state || "",
          postcode: shippingAddress?.postcode || "",
          country: shippingAddress?.country_code || "AU",
          phone: shippingAddress?.phone || "",
          email,
        },
        items: (lineItems || []).map((item: any) => ({
          description: item.title || "Product",
          qty: item.quantity || 1,
          price: item.price || 0,
          sku: item.variantId || undefined,
          weight: 0.2, // default 200g per item; update with real weights when available
        })),
      })
      console.log('[starshipit] Push result:', JSON.stringify(result))
    } catch (err: any) {
      console.error('[starshipit] Push failed:', err?.message, JSON.stringify(err))
    }

    // Step 4: Send Meta Conversions API (server-side tracking)
    const cookies = request.headers.get("cookie") || ""
    const fbpMatch = cookies.match(/_fbp=([^;]+)/)
    const fbcMatch = cookies.match(/_fbc=([^;]+)/)

    try {
      await sendMetaCAPI({
        eventName: "Purchase",
        eventTime: Math.floor(Date.now() / 1000),
        userData: {
          email,
          firstName,
          lastName,
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          zip: shippingAddress?.postcode,
          country: shippingAddress?.country_code || "AU",
          phone: shippingAddress?.phone,
          fbp: fbpMatch?.[1],
          fbc: fbcMatch?.[1],
        },
        customData: {
          value: paymentIntent.amount / 100,
          currency: "AUD",
          contentType: "product",
          contentIds: (lineItems || []).map((item: any) =>
            item.variantId ? item.variantId.split("/").pop() : item.title
          ),
          orderId: orderName || draftOrderName || paymentIntentId,
        },
        sourceUrl: request.headers.get("referer") || "https://www.saltandstone.com.au/checkout",
      })
      console.log("[meta-capi] Purchase event sent")
    } catch (err: any) {
      console.error("[meta-capi] Failed:", err?.message)
    }

    return NextResponse.json({
      success: true,
      orderId: orderName || draftOrderName || paymentIntentId,
      orderTotal: paymentIntent.amount / 100,
      currency: "AUD",
      items: (lineItems || []).map((item: any) => ({
        item_id: item.variantId ? item.variantId.split("/").pop() : undefined,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    })
  } catch (error: any) {
    console.error("[checkout] complete error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to complete order" },
      { status: 500 }
    )
  }
}
