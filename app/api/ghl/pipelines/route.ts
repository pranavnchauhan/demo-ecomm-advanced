import { NextResponse } from "next/server"
import {
  getPipelines,
  createOpportunity,
  updateOpportunityStage,
} from "@/lib/ghl"

export async function GET() {
  try {
    const result = await getPipelines()
    return NextResponse.json(result)
  } catch (error) {
    console.error("GHL pipelines error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pipelines" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case "createOpportunity": {
        const result = await createOpportunity(data)
        return NextResponse.json(result)
      }
      case "updateStage": {
        const result = await updateOpportunityStage(
          data.opportunityId,
          data.stageId
        )
        return NextResponse.json(result)
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("GHL pipelines error:", error)
    return NextResponse.json(
      { error: "GHL pipeline API request failed" },
      { status: 500 }
    )
  }
}
