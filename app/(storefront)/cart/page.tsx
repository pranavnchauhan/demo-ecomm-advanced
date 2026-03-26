"use client"

import { useCart } from "@/components/cart/cart-context"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { brand } from "@/config/brand"

export default function CartPage() {
  const { cart, updateItem, removeItem, operationInProgress, itemCount } = useCart()

  const lines = cart?.lines.edges.map((e) => e.node) ?? []
  const subtotal = parseFloat(cart?.cost.subtotalAmount?.amount ?? "0")
  const currency = cart?.cost.subtotalAmount?.currencyCode ?? "AUD"
  const freeShippingThreshold = brand.shipping.freeThresholdDomestic
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40">
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-serif">Your cart is empty</h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40">
      <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {lines.map((line) => {
            const image = line.merchandise.product?.images?.edges?.[0]?.node
            const options = line.merchandise.selectedOptions
              ?.filter((o) => o.name !== "Title")

            return (
              <div key={line.id} className="flex gap-4 p-4 border border-border rounded-xl">
                <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {image?.url && (
                    <Image src={image.url} alt={image.altText || ""} fill className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{line.merchandise.product?.title}</h3>
                  {options && options.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {options.map((o) => (
                        <span key={o.name} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                          {o.name}: {o.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItem(line.id, line.quantity - 1)}
                        disabled={operationInProgress}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-8 text-center font-medium">{line.quantity}</span>
                      <button
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        disabled={operationInProgress}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="font-semibold text-sm">
                      ${(parseFloat(line.merchandise.price.amount) * line.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(line.id)}
                  disabled={operationInProgress}
                  className="text-muted-foreground hover:text-destructive self-start p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-xl p-6 sticky top-32">
            <h2 className="text-lg font-serif mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-border my-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)} {currency}</span>
              </div>
            </div>

            {remainingForFreeShipping > 0 && (
              <p className="text-xs text-center text-muted-foreground bg-muted rounded-lg p-2 mb-4">
                Add ${remainingForFreeShipping.toFixed(2)} more to get free shipping!
              </p>
            )}

            <Link
              href="/checkout"
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="block text-sm text-center text-muted-foreground hover:text-foreground mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
