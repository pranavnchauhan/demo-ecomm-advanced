import { NextResponse } from "next/server"

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

export async function POST(request: Request) {
  try {
    const { name, email, subject, orderNumber, message, turnstileToken } = await request.json()

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

    console.log("[contact] Received submission (no-op):", { name, email, subject, orderNumber, message })

    // TODO: Wire this submission to a CRM or email provider (e.g. Resend)
    // once one is configured for this project.

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
