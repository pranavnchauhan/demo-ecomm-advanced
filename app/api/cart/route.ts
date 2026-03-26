// Cart API - uses Shopify Storefront cart mutations
// Falls back to a demo-mode local cart when Shopify credentials are not set
import { NextRequest, NextResponse } from 'next/server'

const hasShopify = !!(
  process.env.SHOPIFY_STOREFRONT_TOKEN ||
  (process.env.SHOPIFY_ADMIN_CLIENT_ID && process.env.SHOPIFY_ADMIN_CLIENT_SECRET)
)

// Lazy-import Shopify functions only when credentials exist
async function getShopifyFns() {
  const mod = await import('@/lib/shopify')
  return mod
}

// ── Demo mode: in-memory cart store (per-process) ──────────────────
// In demo mode we don't call Shopify at all. The cart shape matches ShopifyCart.
import { staticProducts } from '@/lib/product-data'

let demoCart: any = null

function findStaticVariant(variantId: string) {
  for (const p of staticProducts) {
    const v = p.variants.find((v) => v.id === variantId)
    if (v) return { variant: v, product: p }
  }
  return null
}

function buildDemoCartResponse() {
  if (!demoCart || demoCart.lines.length === 0) {
    return { cart: null }
  }
  const subtotal = demoCart.lines.reduce(
    (sum: number, l: any) => sum + parseFloat(l.merchandise.price.amount) * l.quantity,
    0
  )
  return {
    cart: {
      id: demoCart.id,
      checkoutUrl: '/checkout',
      cost: {
        totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'AUD' },
        subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'AUD' },
        totalTaxAmount: null,
      },
      lines: {
        edges: demoCart.lines.map((l: any) => ({ node: l })),
      },
    },
  }
}

function handleDemoAction(body: any) {
  const { action, variantId, quantity, lineId } = body

  switch (action) {
    case 'create': {
      const found = findStaticVariant(variantId)
      if (!found) return { cart: null, error: 'Variant not found' }
      const lineItemId = `demo-line-${Date.now()}`
      demoCart = {
        id: `demo-cart-${Date.now()}`,
        lines: [
          {
            id: lineItemId,
            quantity: quantity || 1,
            merchandise: {
              id: found.variant.id,
              title: found.variant.title,
              availableForSale: true,
              selectedOptions: found.variant.selectedOptions,
              price: found.variant.price,
              product: {
                title: found.product.title,
                handle: found.product.handle,
                images: found.product.images,
              },
            },
          },
        ],
      }
      return buildDemoCartResponse()
    }
    case 'get': {
      return buildDemoCartResponse()
    }
    case 'addLines': {
      if (!demoCart) {
        // Create fresh cart
        return handleDemoAction({ ...body, action: 'create' })
      }
      // Check if variant already in cart
      const existing = demoCart.lines.find(
        (l: any) => l.merchandise.id === variantId
      )
      if (existing) {
        existing.quantity += quantity || 1
      } else {
        const found = findStaticVariant(variantId)
        if (!found) return buildDemoCartResponse()
        demoCart.lines.push({
          id: `demo-line-${Date.now()}`,
          quantity: quantity || 1,
          merchandise: {
            id: found.variant.id,
            title: found.variant.title,
            availableForSale: true,
            selectedOptions: found.variant.selectedOptions,
            price: found.variant.price,
            product: {
              title: found.product.title,
              handle: found.product.handle,
              images: found.product.images,
            },
          },
        })
      }
      return buildDemoCartResponse()
    }
    case 'updateLines': {
      if (!demoCart) return { cart: null }
      const line = demoCart.lines.find((l: any) => l.id === lineId)
      if (line) {
        if (quantity <= 0) {
          demoCart.lines = demoCart.lines.filter((l: any) => l.id !== lineId)
        } else {
          line.quantity = quantity
        }
      }
      return buildDemoCartResponse()
    }
    case 'removeLines': {
      if (!demoCart) return { cart: null }
      demoCart.lines = demoCart.lines.filter((l: any) => l.id !== lineId)
      return buildDemoCartResponse()
    }
    default:
      return { error: 'Unknown action' }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Demo mode — no Shopify credentials
    if (!hasShopify) {
      const result = handleDemoAction(body)
      return NextResponse.json(result)
    }

    // Real Shopify mode
    const { createCart, getCart, addToCart, updateCartItem, removeCartItem } =
      await getShopifyFns()
    const { action, cartId, variantId, quantity, lineId } = body

    switch (action) {
      case 'create': {
        if (!variantId) return NextResponse.json({ error: 'Missing variantId' }, { status: 400 })
        const cart = await createCart(variantId, quantity || 1)
        return NextResponse.json({ cart })
      }
      case 'get': {
        if (!cartId) return NextResponse.json({ cart: null })
        const cart = await getCart(cartId)
        return NextResponse.json({ cart })
      }
      case 'addLines': {
        if (!cartId || !variantId) return NextResponse.json({ error: 'Missing cartId or variantId' }, { status: 400 })
        const cart = await addToCart(cartId, variantId, quantity || 1)
        return NextResponse.json({ cart })
      }
      case 'updateLines': {
        if (!cartId || !lineId) return NextResponse.json({ error: 'Missing cartId or lineId' }, { status: 400 })
        const cart = await updateCartItem(cartId, lineId, quantity ?? 1)
        return NextResponse.json({ cart })
      }
      case 'removeLines': {
        if (!cartId || !lineId) return NextResponse.json({ error: 'Missing cartId or lineId' }, { status: 400 })
        const cart = await removeCartItem(cartId, lineId)
        return NextResponse.json({ cart })
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json({ cart: null, error: 'Shopify unavailable' }, { status: 200 })
  }
}
