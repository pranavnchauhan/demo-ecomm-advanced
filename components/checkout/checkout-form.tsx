"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useCart } from "@/components/cart/cart-context"
import { AddressAutocomplete } from "@/components/checkout/address-autocomplete"
import { TariffNotice } from "@/components/checkout/tariff-notice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ChevronRight, ChevronLeft, ShieldCheck, Truck, Package } from "lucide-react"
import type { ShippingRate } from "@/lib/starshipit"
import { getFreeShippingThreshold } from "@/lib/starshipit"

const StripePaymentWrapper = dynamic(
  () => import("@/components/checkout/stripe-payment-wrapper"),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
    ssr: false,
  }
)

type Step = "info" | "payment"

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount)
}

export function CheckoutForm() {
  const { cart, isInitializing, clearCart, refreshCart } = useCart()

  // Re-fetch from Shopify on every checkout mount so the order summary always
  // reflects current cart state, not stale context from earlier in the session.
  useEffect(() => {
    refreshCart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firedBeginCheckout = useRef(false)
  useEffect(() => {
    if (isInitializing || firedBeginCheckout.current) return
    const lines = cart?.lines?.edges?.map((e: any) => e.node) || []
    if (lines.length === 0) return
    firedBeginCheckout.current = true
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: cart?.cost?.subtotalAmount?.currencyCode || "AUD",
        value: parseFloat(cart?.cost?.subtotalAmount?.amount || "0"),
        items: lines.map((line: any) => ({
          item_id: line.merchandise?.product?.id?.split("/").pop(),
          item_name: line.merchandise?.product?.title || "Product",
          price: parseFloat(line.merchandise?.price?.amount || "0"),
          quantity: line.quantity || 1,
        })),
      },
    })
  }, [isInitializing, cart])

  const router = useRouter()

  const cartLines = cart?.lines?.edges?.map((e: any) => e.node) || []
  const hasItems = cartLines.length > 0
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0')

  const [step, setStep] = useState<Step>("info")
  const [address, setAddress] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    country_code: "AU",
    phone: "",
  })

  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountError, setDiscountError] = useState("")
  const [checkingDiscount, setCheckingDiscount] = useState(false)

  const applyDiscount = async () => {
    if (discountCode.trim().toUpperCase() !== "WELCOME2PU") {
      setDiscountApplied(false)
      setDiscountError("Invalid discount code.")
      return
    }
    if (!address.email) {
      setDiscountError("Please enter your email address first.")
      return
    }
    setCheckingDiscount(true)
    setDiscountError("")
    try {
      const res = await fetch("/api/shopify/customer-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address.email.trim().toLowerCase() }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.hasOrders) {
          setDiscountApplied(false)
          setDiscountError("This discount is for new customers only.")
        } else {
          setDiscountApplied(true)
        }
      } else {
        // In demo mode, just apply the discount
        setDiscountApplied(true)
      }
    } catch {
      // In demo mode when Shopify is unavailable, apply the discount
      setDiscountApplied(true)
    }
    setCheckingDiscount(false)
  }

  const discountAmount = discountApplied ? subtotal * 0.1 : 0
  const discountedSubtotal = subtotal - discountAmount


  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)

  const [clientSecret, setClientSecret] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")
  const [loadingPayment, setLoadingPayment] = useState(false)

  // Fetch shipping rates
  const fetchRates = async () => {
    console.log("[v0] fetchRates called, address:", address.street, address.city, address.state, address.postcode)
    setLoadingRates(true)
    try {
      const body = {
        destination: {
          street: address.street,
          suburb: address.city,
          city: address.city,
          state: address.state,
          postcode: address.postcode,
          country_code: address.country_code,
        },
        items: cartLines.map((line: any) => ({
          quantity: line.quantity || 1,
          weight: 200,
          description: line.merchandise?.product?.title || "Product",
        })),
        subtotal,
      }
      console.log("[v0] Shipping request body:", JSON.stringify(body))
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      console.log("[v0] Shipping response status:", res.status)
      const data = await res.json()
      console.log("[v0] Shipping response data:", JSON.stringify(data).substring(0, 500))
      if (data.rates?.length) {
        setShippingRates(data.rates)
        setSelectedRate(data.rates[0])
      } else {
        console.log("[v0] No rates returned, using empty array")
      }
    } catch (err) {
      console.error("[v0] Failed to fetch rates:", err)
    }
    setLoadingRates(false)
  }

  const isDemoPayment = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  // Create payment intent
  const createPaymentIntent = async () => {
    // In demo mode, skip the real Stripe API call
    if (isDemoPayment) {
      setClientSecret("demo_secret")
      setPaymentIntentId("demo_pi")
      return
    }
    setLoadingPayment(true)
    try {
      const totalAmount = discountedSubtotal + (selectedRate?.total_price || 0)
      const res = await fetch("/api/checkout/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "aud",
          email: address.email,
          name: `${address.firstName} ${address.lastName}`.trim(),
          metadata: {
            email: address.email,
            shipping: selectedRate?.service_name || "standard",
          },
        }),
      })
      const data = await res.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId)
      }
    } catch (err) {
      console.error("Failed to create payment intent:", err)
    }
    setLoadingPayment(false)
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <Package className="h-16 w-16 text-muted-foreground/40" />
        <div className="text-center">
          <h2 className="font-serif text-xl">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add some products before checking out.
          </p>
        </div>
        <Button onClick={() => router.push("/shop")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* Left: Steps */}
      <div className="space-y-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm">
          {(["info", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <span
                className={
                  step === s
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {s === "info"
                  ? "Information & Shipping"
                  : "Payment"}
              </span>
            </div>
          ))}
        </div>

        {/* Step: Information */}
        {step === "info" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!selectedRate) return
              await createPaymentIntent()
              setStep("payment")
            }}
            className="space-y-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Continue Shopping
            </Link>

            <h2 className="font-serif text-lg">Contact & Shipping Address</h2>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={address.email}
                onChange={(e) => {
                  setAddress((p) => ({ ...p, email: e.target.value }))
                }}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={address.firstName}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, firstName: e.target.value }))
                  }
                  autoComplete="given-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={address.lastName}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, lastName: e.target.value }))
                  }
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <AddressAutocomplete
                id="street"
                required
                defaultValue={address.street}
                placeholder="Enter your street address"
                onSelect={(result) =>
                  setAddress((p) => ({
                    ...p,
                    street: result.street,
                    city: result.city,
                    state: result.state,
                    postcode: result.postcode,
                    country_code: result.country_code,
                  }))
                }
                onManualChange={(val) =>
                  setAddress((p) => ({ ...p, street: val }))
                }
              />
            </div>

            <div>
              <Label htmlFor="apartment">Apartment / Suite (optional)</Label>
              <Input
                id="apartment"
                value={address.apartment}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, apartment: e.target.value }))
                }
                autoComplete="address-line2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, city: e.target.value }))
                  }
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  required
                  value={address.state}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, state: e.target.value }))
                  }
                  autoComplete="address-level1"
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  required
                  value={address.postcode}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, postcode: e.target.value }))
                  }
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={address.phone}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, phone: e.target.value }))
                }
                autoComplete="tel"
              />
            </div>

            <div>
              <Label htmlFor="discountCode">Discount Code (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="discountCode"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value)
                    setDiscountApplied(false)
                    setDiscountError("")
                  }}
                  placeholder="Enter code"
                />
                <Button type="button" variant="outline" onClick={applyDiscount} disabled={checkingDiscount}>
                  {checkingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
              {discountApplied && (
                <p className="mt-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  10% discount applied!
                </p>
              )}
              {discountError && (
                <p className="mt-1.5 text-sm text-destructive">{discountError}</p>
              )}
            </div>

            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={loadingRates || !address.street || !address.city || !address.state || !address.postcode}
              onClick={async () => {
                await fetchRates()
              }}
            >
              {loadingRates ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating shipping...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Calculate Shipping
                </>
              )}
            </Button>

            <TariffNotice
              countryCode={address.country_code}
              show={shippingRates.length === 0 && !loadingRates && !!address.street}
            />

            {/* Show rates inline after fetching */}
            {shippingRates.length > 0 && !loadingRates && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm font-medium">Available Shipping Options</p>
                <RadioGroup
                  value={selectedRate?.service_code || ""}
                  onValueChange={(val) => {
                    const rate = shippingRates.find((r) => r.service_code === val)
                    if (rate) setSelectedRate(rate)
                  }}
                  className="space-y-2"
                >
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.service_code}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={rate.service_code} />
                        <div>
                          <p className="text-sm font-medium">{rate.service_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {rate.carrier_name}
                            {rate.estimated_days
                              ? ` - ${rate.estimated_days} business days`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {rate.total_price === 0
                          ? "FREE"
                          : formatPrice(rate.total_price)}
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                <TariffNotice countryCode={address.country_code} show={true} />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!selectedRate}
                >
                  Continue to Payment
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg">Payment</h2>

            {!isDemoPayment && (loadingPayment || !clientSecret) ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Preparing secure payment...
                </span>
              </div>
            ) : (
              <StripePaymentWrapper
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                address={address}
                cartLines={cartLines}
                selectedRate={selectedRate}
                clearCart={clearCart}
                discountCode={discountApplied ? discountCode.trim().toUpperCase() : undefined}
              />
            )}

            <Button
              variant="outline"
              onClick={() => setStep("info")}
              className="w-full"
            >
              Back to Information
            </Button>
          </div>
        )}

        {/* Trust signals */}
        <div className="flex items-center gap-6 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="h-4 w-4" />
            <span>Australian owned</span>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-serif text-lg">Order Summary</h3>

        <ul className="mt-4 divide-y divide-border">
          {cartLines.map((line: any) => {
            const image = line.merchandise?.product?.images?.edges?.[0]?.node
            const price = parseFloat(line.merchandise?.price?.amount || "0")
            return (
              <li key={line.id} className="flex gap-3 py-3">
                {image && (
                  <div className="relative flex-shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={image.url}
                        alt={image.altText || "Product"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                      {line.quantity}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {line.merchandise?.product?.title}
                    </p>
                    {line.merchandise?.title !== "Default Title" && (
                      <p className="text-xs text-muted-foreground">
                        {line.merchandise?.title}
                      </p>
                    )}
                  </div>
                  <p className="text-sm">{formatPrice(price * line.quantity)}</p>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Free shipping progress — only shown once country is known from address entry */}
        {address.street && (() => {
          const threshold = getFreeShippingThreshold(address.country_code)
          const remaining = threshold - subtotal
          return remaining > 0 ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              You&apos;re{" "}
              <span className="font-medium text-foreground">{formatPrice(remaining)}</span>{" "}
              away from free shipping
            </p>
          ) : (
            <p className="mt-4 text-center text-xs font-medium text-green-700">
              🎉 You qualify for free shipping!
            </p>
          )
        })()}

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountApplied && (
            <div className="flex justify-between text-green-700">
              <span>Discount ({discountCode.trim().toUpperCase()} −10%)</span>
              <span>−{formatPrice(discountAmount)}</span>
            </div>
          )}
          {selectedRate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {selectedRate.total_price === 0
                  ? "FREE"
                  : formatPrice(selectedRate.total_price)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>Total</span>
            <span>
              {formatPrice(discountedSubtotal + (selectedRate?.total_price || 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
