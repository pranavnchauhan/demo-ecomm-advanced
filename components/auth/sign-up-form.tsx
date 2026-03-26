"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function SignUpForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/account`,
        data: {
          first_name: firstName,
          last_name: lastName,
          marketing_consent: marketing,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Also push to GHL in the background
    try {
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          marketingConsent: marketing,
        }),
      })
    } catch {
      // Non-critical
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="mt-8 text-center">
        <p className="font-serif text-xl text-foreground">Check your email</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {"We've sent a confirmation link to "}
          <strong className="text-foreground">{email}</strong>. Click the link
          to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

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
          className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
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
          minLength={8}
          className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          placeholder="Minimum 8 characters"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <span className="text-xs text-muted-foreground">
          I would like to receive wellness tips, new flavours, and exclusive offers.
        </span>
      </label>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-foreground py-6 text-sm uppercase tracking-widest text-primary-foreground hover:bg-foreground/90"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="border-b border-foreground text-foreground hover:border-accent hover:text-accent"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
