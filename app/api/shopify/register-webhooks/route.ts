import { NextResponse } from "next/server"
import { adminFetch } from "@/lib/shopify"

/**
 * POST /api/shopify/register-webhooks
 * One-time setup route. Call this once from the terminal or Postman
 * to register Shopify → Starshipit and Shopify → this app webhooks.
 *
 * Requires WEBHOOK_SETUP_SECRET env var to prevent unauthorized calls.
 * curl -X POST https://your-domain.com/api/shopify/register-webhooks \
 *   -H "x-setup-secret: <WEBHOOK_SETUP_SECRET>"
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret")
  if (!secret || secret !== process.env.WEBHOOK_SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // NEXT_PUBLIC_SITE_URL must be set to the stable production URL (not a preview deployment).
  // e.g. https://saltandstone.vercel.app — update to https://www.saltandstone.com.au after domain cutover.
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SITE_URL env var required" },
      { status: 500 }
    )
  }

  const baseUrl = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`

  // Webhooks to register: [topic, callbackUrl]
  const webhooks = [
    // Starshipit — import paid orders for fulfilment
    ["orders/paid", "https://app.starshipit.com/api/webhook/shopify"],
    // This app — sync customer data to GHL
    ["orders/create", `${baseUrl}/api/webhooks/shopify`],
    ["orders/paid", `${baseUrl}/api/webhooks/shopify`],
    ["checkouts/delete", `${baseUrl}/api/webhooks/shopify`],
  ]

  const mutation = `
    mutation WebhookCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
      webhookSubscriptionCreate(
        topic: $topic
        webhookSubscription: { callbackUrl: $callbackUrl, format: JSON }
      ) {
        webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } }
        userErrors { field message }
      }
    }
  `

  const results = []
  for (const [topic, callbackUrl] of webhooks) {
    const result = await adminFetch<any>(mutation, { topic: topic.toUpperCase().replace("/", "_"), callbackUrl })
    const sub = result?.data?.webhookSubscriptionCreate?.webhookSubscription
    const errors = result?.data?.webhookSubscriptionCreate?.userErrors
    results.push({
      topic,
      callbackUrl,
      id: sub?.id ?? null,
      errors: errors?.length ? errors : undefined,
    })
  }

  console.log("[register-webhooks] results:", JSON.stringify(results, null, 2))
  return NextResponse.json({ baseUrl, registered: results })
}
