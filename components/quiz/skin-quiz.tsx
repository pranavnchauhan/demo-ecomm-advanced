"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { QuizResults } from "./quiz-results"

type QuizAnswer = {
  questionId: string
  value: string
}

type QuizStep = {
  id: string
  question: string
  subtitle: string
  options: { value: string; label: string; description: string }[]
}

const STEPS: QuizStep[] = [
  {
    id: "goal",
    question: "What are you looking for?",
    subtitle: "We will tailor our recommendation based on your answer.",
    options: [
      {
        value: "relax",
        label: "Relaxation & Stress Relief",
        description: "Unwind after a long day with calming rituals",
      },
      {
        value: "skincare",
        label: "Skin Care & Glow",
        description: "Smoother, softer skin with natural ingredients",
      },
      {
        value: "ambience",
        label: "Home Ambience",
        description: "Create a calming atmosphere in your space",
      },
      {
        value: "gift",
        label: "A Gift for Someone Special",
        description: "Find the perfect natural body care gift",
      },
    ],
  },
  {
    id: "routine",
    question: "What does your self-care routine look like?",
    subtitle: "This helps us match you with the right product.",
    options: [
      { value: "bath", label: "I love a long bath", description: "A soak is my favourite way to unwind" },
      { value: "shower", label: "Quick shower, keep it efficient", description: "I prefer products I can use in the shower" },
      { value: "evening", label: "Evening wind-down ritual", description: "Candles, dim lights, relaxation" },
      { value: "active", label: "Post-workout recovery", description: "I need something soothing after exercise" },
    ],
  },
  {
    id: "scent",
    question: "Which scent family appeals to you most?",
    subtitle: "Pick the one that feels most natural.",
    options: [
      { value: "floral", label: "Floral & Soft", description: "Lavender, rose, chamomile" },
      { value: "fresh", label: "Fresh & Invigorating", description: "Eucalyptus, peppermint, citrus" },
      { value: "warm", label: "Warm & Earthy", description: "Sandalwood, cedarwood, vanilla" },
      { value: "unscented", label: "Fragrance-Free", description: "Pure and simple, no added scent" },
    ],
  },
]

function calculateProfile(answers: QuizAnswer[]): string {
  const map = Object.fromEntries(answers.map((a) => [a.questionId, a.value]))

  if (map.routine === "bath" || map.goal === "relax") return "bath_lover"
  if (map.routine === "shower" || map.goal === "skincare") return "scrub_fan"
  if (map.routine === "evening" || map.goal === "ambience") return "candle_enthusiast"
  if (map.goal === "gift") return "gift_giver"
  return "essential_oil_lover"
}

export function SkinQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{
    profileType: string
    recommendations: string[]
  } | null>(null)

  const currentStep = STEPS[step]
  const currentAnswer = answers.find((a) => a.questionId === currentStep?.id)
  const totalSteps = STEPS.length
  const progress = (step / totalSteps) * 100
  const isLastStep = step === totalSteps - 1

  function selectAnswer(value: string) {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentStep.id)
      return [...filtered, { questionId: currentStep.id, value }]
    })
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.fromEntries(
            answers.map((a) => [a.questionId, a.value])
          ),
          sessionId: `quiz_${Date.now()}`,
        }),
      })
      const data = await res.json()
      setResults(data)
    } catch {
      const profileType = calculateProfile(answers)
      setResults({ profileType, recommendations: [] })
    }
    setIsSubmitting(false)
  }

  if (results) {
    return <QuizResults profileType={results.profileType} recommendations={results.recommendations} />
  }

  if (!currentStep) return null

  return (
    <div className="flex flex-col items-center">
      {/* Progress bar */}
      <div className="mb-12 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 h-0.5 w-full bg-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center">
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-4xl text-balance">
          {currentStep.question}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {currentStep.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="mt-10 flex w-full flex-col gap-3">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            onClick={() => selectAnswer(option.value)}
            className={`flex flex-col items-start border px-6 py-5 text-left transition-all ${
              currentAnswer?.value === option.value
                ? "border-foreground bg-foreground text-primary-foreground"
                : "border-border text-foreground hover:border-foreground/50"
            }`}
          >
            <span className="text-sm font-medium">{option.label}</span>
            <span
              className={`mt-1 text-xs ${
                currentAnswer?.value === option.value
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {option.description}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex w-full items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="gap-2 text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!currentAnswer || isSubmitting}
            className="gap-2 bg-foreground px-8 py-6 text-sm uppercase tracking-widest text-primary-foreground hover:bg-foreground/90"
          >
            <Sparkles className="h-4 w-4" />
            {isSubmitting ? "Finding your match..." : "See My Results"}
          </Button>
        ) : (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!currentAnswer}
            className="gap-2 bg-foreground px-8 py-6 text-sm uppercase tracking-widest text-primary-foreground hover:bg-foreground/90"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
