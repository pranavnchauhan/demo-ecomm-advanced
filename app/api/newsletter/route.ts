import { NextResponse } from "next/server"
import { createContact, addContactTag } from "@/lib/ghl"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Push to GHL as newsletter subscriber
    try {
      const result = await createContact({
        email,
        tags: ["lifecycle:subscriber", "source:organic"],
      }) as { contact?: { id: string } }

      if (result?.contact?.id) {
        await addContactTag(result.contact.id, ["newsletter-active"])
      }
    } catch (ghlError) {
      console.error("GHL newsletter sync error:", ghlError)
      // Don't fail the request if GHL is unavailable
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
