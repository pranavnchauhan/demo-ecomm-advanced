import { NextResponse } from "next/server"

// TODO: Wire this signup event to a CRM or email provider once one is
// configured for this project. Currently a no-op — validates and accepts
// the request but does not forward it anywhere.
export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, marketingConsent } =
      await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    console.log("[auth/sync] Signup received (no-op):", {
      email,
      firstName,
      lastName,
      marketingConsent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Auth sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync" },
      { status: 500 }
    )
  }
}
