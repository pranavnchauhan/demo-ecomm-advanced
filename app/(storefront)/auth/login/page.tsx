import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Salt & Stone AU account.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your account and orders.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
