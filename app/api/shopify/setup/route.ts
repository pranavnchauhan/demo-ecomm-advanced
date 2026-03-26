import { NextResponse } from 'next/server'
import { getStorefrontToken } from '@/lib/shopify'

export async function GET() {
  const token = await getStorefrontToken()
  if (!token) {
    return NextResponse.json({ error: 'Failed to get storefront token' }, { status: 500 })
  }
  return NextResponse.json({
    token,
    instructions: 'Add SHOPIFY_STOREFRONT_TOKEN to your Vercel environment variables with the token value above.',
  })
}
