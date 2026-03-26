import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Salt & Stone AU account for a personalised shopping experience.",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-foreground">
            Join Salt & Stone
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account for a personalised shopping experience.
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
