import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminFetch, getStorefrontToken } from '@/lib/shopify'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: Record<string, any> = {}

  // 1. Existing token count from Shopify
  try {
    const listRes = await adminFetch<any>(`
      query {
        storefrontAccessTokens(first: 100) {
          edges { node { id title } }
        }
      }
    `)
    const edges = listRes?.data?.storefrontAccessTokens?.edges ?? []
    result.shopify_token_count = edges.length
    result.shopify_tokens = edges.map((e: any) => ({ id: e.node.id, title: e.node.title }))
  } catch (err: any) {
    result.shopify_token_error = err.message
  }

  // 2. Supabase cached token check
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data, error } = await supabase
        .from('shopify_config')
        .select('value')
        .eq('key', 'storefront_token')
        .single()
      result.supabase_has_token = !!data?.value
      result.supabase_token_prefix = data?.value ? data.value.substring(0, 10) + '...' : null
      if (error && error.code !== 'PGRST116') result.supabase_error = error.message
    } else {
      result.supabase_has_token = false
      result.supabase_error = 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set'
    }
  } catch (err: any) {
    result.supabase_has_token = false
    result.supabase_error = err.message
  }

  // 3. getStorefrontToken() result
  try {
    const token = await getStorefrontToken()
    if (token) {
      result.success = true
      result.token_prefix = token.substring(0, 10) + '...'
      result.token_length = token.length
    } else {
      result.success = false
      result.error = 'getStorefrontToken() returned null — check server logs for details'
    }
  } catch (err: any) {
    result.success = false
    result.error = err.message
  }

  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
