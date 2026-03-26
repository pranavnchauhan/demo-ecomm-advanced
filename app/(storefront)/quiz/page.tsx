import type { Metadata } from "next"
import { SkinQuiz } from "@/components/quiz/skin-quiz"

export const metadata: Metadata = {
  title: "Find Your Ritual | Salt & Stone AU Quiz",
  description: "Take our 60-second quiz to find the right Salt & Stone AU product for your self-care routine. Bath salts, body scrubs, essential oils, and candles - matched to your lifestyle.",
  alternates: {
    canonical: "https://www.saltandstone.com.au/quiz",
  },
}

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
      <SkinQuiz />
    </div>
  )
}
