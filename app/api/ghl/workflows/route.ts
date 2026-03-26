import { NextResponse } from "next/server"
import {
  addContactToWorkflow,
  removeContactFromWorkflow,
} from "@/lib/ghl"

export async function POST(request: Request) {
  try {
    const { action, contactId, workflowId } = await request.json()

    if (!contactId || !workflowId) {
      return NextResponse.json(
        { error: "contactId and workflowId are required" },
        { status: 400 }
      )
    }

    switch (action) {
      case "add": {
        const result = await addContactToWorkflow(contactId, workflowId)
        return NextResponse.json(result)
      }
      case "remove": {
        const result = await removeContactFromWorkflow(contactId, workflowId)
        return NextResponse.json(result)
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("GHL workflows error:", error)
    return NextResponse.json(
      { error: "GHL workflow API request failed" },
      { status: 500 }
    )
  }
}
