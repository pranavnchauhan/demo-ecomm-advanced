import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
      <h1 className="mb-8 font-serif text-2xl tracking-wide md:text-3xl">
        Checkout
      </h1>
      <CheckoutForm />
    </main>
  )
}
