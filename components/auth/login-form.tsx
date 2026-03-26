"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/account")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          placeholder="Enter your password"
        />
      </div>

      <div className="text-right mb-4">
        <Link
          href="/auth/reset-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-foreground py-6 text-sm uppercase tracking-widest text-primary-foreground hover:bg-foreground/90"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <Link
          href="/auth/sign-up"
          className="border-b border-foreground text-foreground hover:border-accent hover:text-accent"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}
