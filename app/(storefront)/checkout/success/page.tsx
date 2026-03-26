"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pu_order_complete")
      if (!raw) return
      const { orderId, orderTotal, currency, items } = JSON.parse(raw)
      sessionStorage.removeItem("pu_order_complete")
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: orderId,
          value: orderTotal,
          currency: currency || "AUD",
          items: items,
        },
      })
    } catch {
      // sessionStorage unavailable or malformed — skip
    }
  }, [])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600" />
      <h1 className="mt-6 font-serif text-2xl md:text-3xl">
        Thank you for your order!
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We have received your payment and your order is being prepared.
        You will receive a confirmation email shortly.
      </p>
      <Button asChild className="mt-8">
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </main>
  )
}
