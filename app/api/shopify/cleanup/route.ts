import { getAdminToken } from '@/lib/shopify'

export async function POST(request: Request) {
  if (request.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const adminToken = await getAdminToken()
    if (!adminToken) {
      return Response.json({ error: 'Could not get admin token' }, { status: 500 })
    }
    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN
    const adminUrl = `https://${shopDomain}/admin/api/2024-01/graphql.json`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    }
    // Step 1: List all tokens
    const listRes = await fetch(adminUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: `{ storefrontAccessTokens(first: 100) { edges { node { id title } } } }` })
    })
    const listData = await listRes.json()
    const tokens = listData?.data?.storefrontAccessTokens?.edges ?? []
    console.log('[cleanup] found tokens:', tokens.length)
    // Step 2: Delete each one
    for (const { node } of tokens) {
      console.log('[cleanup] deleting:', node.id)
      await fetch(adminUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `mutation { storefrontAccessTokenDelete(input: { id: "${node.id}" }) { deletedStorefrontAccessTokenId userErrors { message } } }`
        })
      })
    }
    // Step 3: Create fresh token
    const createRes = await fetch(adminUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `mutation { storefrontAccessTokenCreate(input: { title: "Salt & Stone Headless" }) { storefrontAccessToken { accessToken } userErrors { message } } }`
      })
    })
    const createData = await createRes.json()
    const newToken = createData?.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken
    const errors = createData?.data?.storefrontAccessTokenCreate?.userErrors
    if (errors?.length) {
      return Response.json({ error: 'Failed to create token', details: errors })
    }
    return Response.json({ success: true, token: newToken })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
