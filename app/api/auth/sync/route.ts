import { NextResponse } from "next/server"
import { createContact, addContactTag, addContactToWorkflow } from "@/lib/ghl"

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, marketingConsent } =
      await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Create/update contact in GHL
    const tags = ["customer", "website-signup"]
    if (marketingConsent) tags.push("marketing-opted-in")

    const result = await createContact({
      email,
      firstName,
      lastName,
      tags,
    }) as { contact?: { id: string } }

    return NextResponse.json({
      success: true,
      ghlContactId: result?.contact?.id,
    })
  } catch (error) {
    console.error("Auth sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync" },
      { status: 500 }
    )
  }
}
