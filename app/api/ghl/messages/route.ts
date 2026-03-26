import { NextResponse } from "next/server"
import { sendSms, sendEmail } from "@/lib/ghl"

export async function POST(request: Request) {
  try {
    const { type, ...data } = await request.json()

    switch (type) {
      case "sms": {
        const result = await sendSms({
          contactId: data.contactId,
          message: data.message,
        })
        return NextResponse.json(result)
      }
      case "email": {
        const result = await sendEmail({
          contactId: data.contactId,
          subject: data.subject,
          body: data.body,
          html: data.html,
        })
        return NextResponse.json(result)
      }
      default:
        return NextResponse.json(
          { error: `Unknown message type: ${type}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("GHL messaging error:", error)
    return NextResponse.json(
      { error: "GHL messaging API request failed" },
      { status: 500 }
    )
  }
}
