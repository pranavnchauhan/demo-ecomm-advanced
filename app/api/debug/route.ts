import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'
  const CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID || ''
  const CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET || ''
  
  const results: Record<string, any> = {
    store_domain: STORE_DOMAIN,
    client_id_set: !!CLIENT_ID,
    client_id_prefix: CLIENT_ID.substring(0, 8),
    client_secret_set: !!CLIENT_SECRET,
    client_secret_prefix: CLIENT_SECRET.substring(0, 8),
  }

  // Step 1: Try OAuth
  try {
    const domain = STORE_DOMAIN.replace('https://', '').replace(/\/$/, '')
    const oauthUrl = `https://${domain}/admin/oauth/access_token`
    results.oauth_url = oauthUrl

    const oauthRes = await fetch(oauthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    results.oauth_status = oauthRes.status
    const oauthText = await oauthRes.text()
    results.oauth_response = oauthText.substring(0, 300)

    if (oauthRes.ok) {
      const oauthJson = JSON.parse(oauthText)
      const adminToken = oauthJson.access_token
      results.admin_token_prefix = adminToken?.substring(0, 10)

      // Step 2: Get storefront token
      const adminGqlUrl = `https://${domain}/admin/api/2025-07/graphql.json`
      const sfRes = await fetch(adminGqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: `{ storefrontAccessTokens(first: 5) { edges { node { accessToken title } } } }`,
        }),
      })
      results.sf_tokens_status = sfRes.status
      const sfJson = await sfRes.json()
      const tokens = sfJson.data?.storefrontAccessTokens?.edges || []
      results.sf_token_count = tokens.length
      if (tokens.length > 0) {
        const sfToken = tokens[0].node.accessToken
        results.sf_token_prefix = sfToken.substring(0, 10)

        // Step 3: Query products via Storefront API
        const storefrontUrl = `https://${domain}/api/2025-07/graphql.json`
        const prodRes = await fetch(storefrontUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': sfToken,
          },
          body: JSON.stringify({
            query: `{ products(first: 5) { edges { node { title handle } } } }`,
          }),
        })
        results.products_status = prodRes.status
        const prodJson = await prodRes.json()
        results.products = prodJson.data?.products?.edges?.map((e: any) => e.node.title) || []
        results.products_errors = prodJson.errors || null
      }
    }
  } catch (err: any) {
    results.error = err.message
  }

  return NextResponse.json(results, { status: 200 })
}
