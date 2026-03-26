import { NextResponse } from "next/server"
import {
  createContact,
  updateContact,
  getContactByEmail,
  addContactTag,
  removeContactTag,
} from "@/lib/ghl"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "create": {
        const result = await createContact(data)
        return NextResponse.json(result)
      }
      case "update": {
        const { contactId, ...updateData } = data
        const result = await updateContact(contactId, updateData)
        return NextResponse.json(result)
      }
      case "find": {
        const result = await getContactByEmail(data.email)
        return NextResponse.json(result)
      }
      case "addTags": {
        const result = await addContactTag(data.contactId, data.tags)
        return NextResponse.json(result)
      }
      case "removeTags": {
        const result = await removeContactTag(data.contactId, data.tags)
        return NextResponse.json(result)
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("GHL contacts error:", error)
    return NextResponse.json(
      { error: "GHL API request failed" },
      { status: 500 }
    )
  }
}
