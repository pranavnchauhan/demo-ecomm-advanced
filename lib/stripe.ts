import Stripe from "stripe"

const isTestMode = process.env.STRIPE_MODE !== "live"

const secretKey = isTestMode
  ? process.env.STRIPE_TEST_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY

export const publishableKey = isTestMode
  ? process.env.STRIPE_TEST_PUBLISHABLE_KEY || ""
  : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

export const stripeMode = isTestMode ? "test" : "live"

export const stripe = secretKey
  ? new Stripe(secretKey)
  : (null as unknown as Stripe)
