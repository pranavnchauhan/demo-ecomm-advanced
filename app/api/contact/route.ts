import { NextResponse } from "next/server"
import { getPipelines, createOpportunity } from "@/lib/ghl"

const GHL_API_KEY = process.env.GHL_API_KEY || ""
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || ""
const GHL_BASE_URL = "https://services.leadconnectorhq.com"
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || ""

async function verifyTurnstileToken(token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token })
  if (ip) body.set("remoteip", ip)
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  "Content-Type": "application/json",
  Version: "2021-07-28",
}

type Pipeline = {
  id: string
  name: string
  stages: Array<{ id: string; name: string }>
}

type PipelinesResponse = {
  pipelines?: Pipeline[]
}

const TRANSACTIONAL_SUBJECTS = ["Order Enquiry", "Shipping", "Returns"]

// Cache the message custom field ID so we only look it up once per cold start
let cachedMessageFieldId: string | null | undefined = undefined

async function getMessageFieldId(): Promise<string | null> {
  if (cachedMessageFieldId !== undefined) return cachedMessageFieldId
  try {
    const res = await fetch(`${GHL_BASE_URL}/custom-fields/?locationId=${GHL_LOCATION_ID}`, {
      headers: ghlHeaders,
    })
    const data = (await res.json()) as { customFields?: Array<{ id: string; key?: string; name?: string }> }
    console.log("[contact] custom-fields response status:", res.status, "| fields:", JSON.stringify(data.customFields?.map((f) => ({ id: f.id, key: f.key, name: f.name }))))
    const field = data.customFields?.find(
      (f) => f.key === "contact.message" || f.key === "message" || f.name?.toLowerCase() === "message"
    )
    cachedMessageFieldId = field?.id ?? null
    console.log("[contact] resolved message field id:", cachedMessageFieldId)
  } catch (err) {
    console.error("[contact] failed to fetch custom field id:", err)
    cachedMessageFieldId = null
  }
  return cachedMessageFieldId
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, orderNumber, message, turnstileToken } = await request.json()

    console.log("[contact] Received submission:", { name, email, subject, orderNumber })
    console.log("[contact] Env check — GHL_API_KEY present:", !!GHL_API_KEY, "| GHL_LOCATION_ID:", GHL_LOCATION_ID || "(empty)")

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // Verify Turnstile CAPTCHA
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "CAPTCHA verification is required." },
        { status: 400 }
      )
    }
    const ip = request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For")
    const captchaValid = await verifyTurnstileToken(turnstileToken, ip)
    if (!captchaValid) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed. Please try again." },
        { status: 400 }
      )
    }

    // Split name into first / last
    const parts = (name as string).trim().split(/\s+/)
    const firstName = parts[0]
    const lastName = parts.slice(1).join(" ") || "."

    // Create contact — handle duplicate (400 with meta.contactId)
    let contactId: string

    const createPayload = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email,
      tags: ["source:website-contact-form", "lifecycle:new-contact"],
      source: "contact-form",
    }
    console.log("[contact] POST /contacts/ payload:", JSON.stringify(createPayload))

    const createRes = await fetch(`${GHL_BASE_URL}/contacts/`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify(createPayload),
    })

    const createBody = await createRes.json()
    console.log("[contact] POST /contacts/ status:", createRes.status, "| body:", JSON.stringify(createBody))

    if (createRes.ok) {
      contactId = (createBody as { contact: { id: string } }).contact.id
      console.log("[contact] Contact created, id:", contactId)
    } else if (createRes.status === 400) {
      const data = createBody as { meta?: { contactId?: string } }
      if (data?.meta?.contactId) {
        contactId = data.meta.contactId
        console.log("[contact] Duplicate contact, using existing id:", contactId)
        const tagRes = await fetch(`${GHL_BASE_URL}/contacts/${contactId}/tags`, {
          method: "POST",
          headers: ghlHeaders,
          body: JSON.stringify({ tags: ["source:website-contact-form"] }),
        })
        const tagBody = await tagRes.text()
        console.log("[contact] POST /contacts/:id/tags status:", tagRes.status, "| body:", tagBody)
      } else {
        console.error("[contact] GHL contact creation error (no contactId in meta):", JSON.stringify(createBody))
        throw new Error("Failed to create or find contact")
      }
    } else {
      throw new Error(`GHL API error: ${createRes.status} ${JSON.stringify(createBody)}`)
    }

    // Save message to GHL custom field (best-effort)
    try {
      const messageFieldId = await getMessageFieldId()
      const messageFieldEntry = messageFieldId
        ? { id: messageFieldId, field_value: message }
        : { key: "contact.message", field_value: message }
      const messageFieldRes = await fetch(`${GHL_BASE_URL}/contacts/${contactId}`, {
        method: "PUT",
        headers: ghlHeaders,
        body: JSON.stringify({ customFields: [messageFieldEntry] }),
      })
      const messageFieldBody = await messageFieldRes.text()
      console.log("[contact] PUT message field (using", messageFieldId ? `id:${messageFieldId}` : "key:contact.message", ") status:", messageFieldRes.status, "| body:", messageFieldBody)
    } catch (err) {
      console.error("[contact] contact.message field update failed (non-fatal):", err)
    }

    // Save subject to GHL custom field (best-effort)
    try {
      const subjectFieldRes = await fetch(`${GHL_BASE_URL}/contacts/${contactId}`, {
        method: "PUT",
        headers: ghlHeaders,
        body: JSON.stringify({ customFields: [{ id: "45jXECLHSzDjJgyYge88", field_value: subject }] }),
      })
      const subjectFieldBody = await subjectFieldRes.text()
      console.log("[contact] PUT custom field contact.contactsubject status:", subjectFieldRes.status, "| body:", subjectFieldBody)
    } catch (err) {
      console.error("[contact] contact.contactsubject field update failed (non-fatal):", err)
    }

    // Add note to contact (best-effort)
    try {
      const notePayload = {
        body: `Contact Form Submission\nSubject: ${subject}\nOrder Number: ${orderNumber || "Not provided"}\nMessage: ${message}`,
      }
      const noteRes = await fetch(`${GHL_BASE_URL}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify(notePayload),
      })
      const noteBody = await noteRes.text()
      console.log("[contact] POST /contacts/:id/notes status:", noteRes.status, "| body:", noteBody)
    } catch (err) {
      console.error("[contact] Note creation failed (non-fatal):", err)
    }

    // Fetch pipelines and create opportunity (best-effort)
    try {
      const pipelinesData = (await getPipelines()) as PipelinesResponse
      console.log("[contact] Pipelines fetched:", JSON.stringify(pipelinesData?.pipelines?.map((p) => ({ id: p.id, name: p.name, stages: p.stages }))))

      const salesPipeline = pipelinesData?.pipelines?.find((p) =>
        p.name.toLowerCase().includes("sales")
      )

      if (!salesPipeline) {
        console.warn("[contact] No sales pipeline found — skipping opportunity creation")
      } else {
        const isTransactional = TRANSACTIONAL_SUBJECTS.includes(subject as string)
        const targetStage = isTransactional
          ? salesPipeline.stages.find((s) => s.name.toLowerCase().includes("contacted"))
          : salesPipeline.stages.find(
              (s) =>
                s.name.toLowerCase().includes("new lead") ||
                s.name.toLowerCase() === "new"
            )

        console.log("[contact] Pipeline:", salesPipeline.name, "| isTransactional:", isTransactional, "| targetStage:", targetStage)

        if (!targetStage) {
          console.warn("[contact] No matching stage found — skipping opportunity creation")
        } else {
          await createOpportunity({
            pipelineId: salesPipeline.id,
            pipelineStageId: targetStage.id,
            contactId,
            name: `${subject} | ${firstName} ${lastName}`,
          })
          console.log("[contact] Opportunity created")
        }
      }
    } catch (err) {
      console.error("[contact] Pipeline/opportunity step failed (non-fatal):", err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[contact] Unhandled error:", error)
    return NextResponse.json(
      {
        error:
          "Failed to send your message. Please try again or email us directly at " + process.env.NEXT_PUBLIC_SUPPORT_EMAIL + ".",
      },
      { status: 500 }
    )
  }
}
