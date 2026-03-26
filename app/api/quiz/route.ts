import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Answers = Record<string, string>

function calculateProfile(answers: Answers): string {
  const goal = answers.goal
  const routine = answers.routine

  if (routine === "bath" || goal === "relax") return "bath_lover"
  if (routine === "shower" || goal === "skincare") return "scrub_fan"
  if (routine === "evening" || goal === "ambience") return "candle_enthusiast"
  if (goal === "gift") return "gift_giver"
  return "essential_oil_lover"
}

const PROFILE_TO_PRODUCT: Record<string, { recommended_product: string; handle: string }> = {
  bath_lover:          { recommended_product: "Himalayan Bath Salts",       handle: "himalayan-bath-salts-lavender" },
  scrub_fan:           { recommended_product: "Coconut Body Scrub",         handle: "coconut-body-scrub" },
  candle_enthusiast:   { recommended_product: "Eucalyptus Soy Candle",      handle: "eucalyptus-mint-soy-candle" },
  essential_oil_lover: { recommended_product: "Lavender Essential Oil",     handle: "lavender-essential-oil-30ml" },
  gift_giver:          { recommended_product: "Our Full Range",             handle: "shop" },
}

export async function POST(request: Request) {
  try {
    const { answers, sessionId } = await request.json() as {
      answers: Answers
      sessionId: string
    }

    if (!answers || !sessionId) {
      return NextResponse.json(
        { error: "answers and sessionId are required" },
        { status: 400 }
      )
    }

    if (!answers.goal) {
      return NextResponse.json(
        { error: "goal is required" },
        { status: 400 }
      )
    }

    const profile = calculateProfile(answers)
    const { recommended_product, handle } = PROFILE_TO_PRODUCT[profile] ?? PROFILE_TO_PRODUCT.bath_lover

    // Save to Supabase — non-fatal if table doesn't exist yet
    try {
      const supabase = await createClient()
      if (supabase) {
        await supabase.from("wellness_quiz_results").insert({
          goal: answers.goal,
          answers: JSON.stringify(answers),
          profile,
          recommended_product,
          created_at: new Date().toISOString(),
        })
      }
    } catch (dbError) {
      console.error("[quiz] Supabase save error:", dbError)
    }

    return NextResponse.json({
      profile,
      recommended_product,
      handle,
      profileType: profile,
      recommendations: [],
    })
  } catch (error) {
    console.error("[quiz] Unhandled error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
