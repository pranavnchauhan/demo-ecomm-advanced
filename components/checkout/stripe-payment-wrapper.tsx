"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, CreditCard } from "lucide-react"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const isTest = process.env.NEXT_PUBLIC_STRIPE_MODE !== "live"
const isDemoMode = !stripeKey

interface StripePaymentWrapperProps {
  clientSecret: string
  paymentIntentId: string
  address: any
  cartLines: any[]
  selectedRate: any
  clearCart: () => void
  discountCode?: string
}

// ── Demo Payment Form (no Stripe key) ──────────────────────────────
function DemoPaymentForm({
  cartLines,
  selectedRate,
  clearCart,
}: Pick<StripePaymentWrapperProps, "cartLines" | "selectedRate" | "clearCart">) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  // Calculate total
  const subtotal = cartLines.reduce((sum: number, line: any) => {
    const price = parseFloat(line.merchandise?.price?.amount || "0")
    return sum + price * (line.quantity || 1)
  }, 0)
  const shipping = selectedRate?.total_price || 0
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 2000))

    setProcessing(false)
    setSuccess(true)

    // Store demo order data for success page
    try {
      sessionStorage.setItem(
        "pu_order_complete",
        JSON.stringify({
          orderId: `DEMO-${Date.now()}`,
          orderTotal: total,
          currency: "AUD",
          items: cartLines.map((line: any) => ({
            item_id: line.merchandise?.product?.id || "demo",
            item_name: line.merchandise?.product?.title || "Product",
            price: parseFloat(line.merchandise?.price?.amount || "0"),
            quantity: line.quantity || 1,
          })),
        })
      )
    } catch {
      // sessionStorage unavailable
    }

    // Wait a moment to show success, then redirect
    setTimeout(() => {
      clearCart()
      router.push("/checkout/success?payment_intent=demo_pi_success")
    }, 1500)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-green-200 bg-green-50 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-green-800">Payment successful!</p>
        <p className="text-xs text-green-600">Redirecting to confirmation...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mock Stripe Elements styling */}
      <div className="rounded-lg border border-border bg-background p-4 space-y-4">
        {/* Card number */}
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Card number</label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
            <CreditCard className="h-4 w-4 text-muted-foreground/50" />
            <input
              type="text"
              defaultValue="4242 4242 4242 4242"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              readOnly
            />
            <div className="flex gap-1">
              <div className="h-5 w-8 rounded bg-[#1A1F71] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white italic">VISA</span>
              </div>
              <div className="h-5 w-8 rounded bg-gray-200 flex items-center justify-center">
                <div className="flex -space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500 opacity-80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry and CVC row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Expiry date</label>
            <div className="rounded-md border border-border bg-background px-3 py-2.5">
              <input
                type="text"
                defaultValue="12/28"
                className="w-full bg-transparent text-sm text-foreground outline-none"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">CVC</label>
            <div className="flex items-center rounded-md border border-border bg-background px-3 py-2.5">
              <input
                type="text"
                defaultValue="123"
                className="flex-1 bg-transparent text-sm text-foreground outline-none"
                readOnly
              />
              <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Stripe badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/50">
        <Lock className="h-3 w-3" />
        <span>Powered by</span>
        <span className="font-semibold text-[#635BFF]">stripe</span>
      </div>

      <Button
        type="submit"
        disabled={processing}
        className="w-full"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          `Pay $${total.toFixed(2)} AUD`
        )}
      </Button>
    </form>
  )
}

// ── Real Stripe wrapper (only loaded when key exists) ──────────────
function RealStripeWrapper(props: StripePaymentWrapperProps) {
  // These imports are safe because @stripe packages are in dependencies
  // and this code path only runs when NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
  const { loadStripe } = require("@stripe/stripe-js") as typeof import("@stripe/stripe-js")
  const { Elements, PaymentElement, useStripe, useElements } = require("@stripe/react-stripe-js") as typeof import("@stripe/react-stripe-js")

  const stripePromise = loadStripe(stripeKey!)

  function PaymentForm() {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!stripe || !elements) return

      setProcessing(true)
      setError("")

      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment failed")
        setProcessing(false)
        return
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
          redirect: "if_required",
        })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        try {
          const completeRes = await fetch("/api/checkout/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: props.paymentIntentId,
              shippingAddress: props.address,
              lineItems: props.cartLines.map((line: any) => ({
                title: line.merchandise?.product?.title || "Product",
                quantity: line.quantity || 1,
                price: parseFloat(
                  line.merchandise?.price?.amount ||
                    line.cost?.totalAmount?.amount ||
                    "0"
                ),
                variantId: line.merchandise?.id,
              })),
              shippingRate: props.selectedRate,
              discountCode: props.discountCode || null,
            }),
          })
          const completeData = await completeRes.json()
          if (completeData.success) {
            try {
              sessionStorage.setItem(
                "pu_order_complete",
                JSON.stringify({
                  orderId: completeData.orderId,
                  orderTotal: completeData.orderTotal,
                  currency: completeData.currency,
                  items: completeData.items,
                }),
              )
            } catch {
              // sessionStorage unavailable
            }
          }
        } catch {
          // Order sync failed but payment succeeded
        }

        props.clearCart()
        router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        {error && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing payment...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </form>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: { theme: "stripe", variables: { borderRadius: "8px" } },
      }}
    >
      <PaymentForm />
    </Elements>
  )
}

export default function StripePaymentWrapper(props: StripePaymentWrapperProps) {
  // Demo mode — show mock payment form
  if (isDemoMode) {
    return (
      <div>
        <div className="mb-3 rounded-md bg-blue-50 px-3 py-1.5 text-center text-xs font-semibold text-blue-800">
          DEMO MODE: this is a simulated payment experience
        </div>
        <DemoPaymentForm
          cartLines={props.cartLines}
          selectedRate={props.selectedRate}
          clearCart={props.clearCart}
        />
      </div>
    )
  }

  // Real Stripe mode
  return (
    <div>
      {isTest && (
        <div className="mb-3 rounded-md bg-yellow-100 px-3 py-1.5 text-center text-xs font-semibold text-yellow-800">
          TEST MODE: payments are not real
        </div>
      )}
      <RealStripeWrapper {...props} />
    </div>
  )
}
