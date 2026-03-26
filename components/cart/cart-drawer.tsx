"use client"

import { useCart } from "./cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X, ShoppingBag, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(parseFloat(amount))
}

export function CartDrawer() {
  const router = useRouter()
  const {
    cart,
    isOpen,
    closeCart,
    updateItem,
    removeItem,
    operationInProgress,
    itemCount,
  } = useCart()

  const lines = cart?.lines.edges.map((e) => e.node) ?? []
  const totalAmount = cart?.cost.totalAmount

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col bg-card text-card-foreground">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-serif text-xl tracking-wide">
            Your Bag ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            <p className="font-serif text-lg text-muted-foreground">
              Your bag is empty
            </p>
            <Button onClick={closeCart} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col gap-4">
                {lines.map((line) => {
                  const image =
                    line.merchandise.product?.images?.edges?.[0]?.node
                  return (
                    <li
                      key={line.id}
                      className="flex gap-4 border-b border-border pb-4"
                    >
                      {image && (
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-secondary">
                          <Image
                            src={image.url}
                            alt={image.altText || "Product"}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium leading-tight">
                              {line.merchandise.product?.title}
                            </p>
                            {line.merchandise.title !== "Default Title" && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {line.merchandise.title}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(line.id)}
                            disabled={operationInProgress}
                            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Remove item"
                          >
                            {operationInProgress ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateItem(line.id, line.quantity - 1)
                              }
                              disabled={operationInProgress}
                              className="flex h-7 w-7 items-center justify-center border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItem(line.id, line.quantity + 1)
                              }
                              disabled={operationInProgress}
                              className="flex h-7 w-7 items-center justify-center border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(
                              (
                                parseFloat(line.merchandise.price.amount) *
                                line.quantity
                              ).toString(),
                              line.merchandise.price.currencyCode,
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {operationInProgress && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating cart…
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-serif text-lg">
                  {totalAmount
                    ? formatPrice(totalAmount.amount, totalAmount.currencyCode)
                    : "$0.00"}
                </span>
              </div>
              <p className="pb-3 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                disabled={operationInProgress}
                className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-sm py-6 disabled:opacity-60"
                onClick={() => {
                  if (operationInProgress) return
                  closeCart()
                  router.push("/checkout")
                }}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
