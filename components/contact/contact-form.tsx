"use client"

import { useRef, useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"

const SUBJECTS = [
  "Order Enquiry",
  "Product Question",
  "Shipping",
  "Returns",
  "General",
]

const inputClass =
  "w-full border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground rounded-none focus:outline-none focus:border-foreground transition-colors"

const labelClass = "font-mono text-xs tracking-[0.2em] uppercase text-foreground"

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    orderNumber: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    if (!turnstileToken) {
      setErrorMsg("Please complete the CAPTCHA verification.")
      setStatus("error")
      return
    }

    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || "Something went wrong. Please try again.")
        setStatus("error")
        turnstileRef.current?.reset()
        setTurnstileToken(null)
        return
      }

      setStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <p className="text-4xl">🌿</p>
        <h2 className="font-serif text-2xl text-foreground">Thank you for reaching out</h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          We&apos;ve received your message and will get back to you within 1 to 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className={labelClass}>
            Subject <span className="text-primary">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="orderNumber" className={labelClass}>
            Order Number{" "}
            <span className="font-sans text-[10px] normal-case tracking-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id="orderNumber"
            name="orderNumber"
            type="text"
            placeholder="#1234"
            value={form.orderNumber}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          placeholder="How can we help?"
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={status === "loading" || !turnstileToken}
        className="rounded-none px-8"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
