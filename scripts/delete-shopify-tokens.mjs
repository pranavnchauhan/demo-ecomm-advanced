#!/usr/bin/env node
/**
 * One-time script to clean up Shopify storefront access tokens and create a fresh one.
 *
 * Usage:
 *   SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=yyy node scripts/delete-shopify-tokens.mjs
 */

const SHOPIFY_STORE = 'salt-and-stone-au.myshopify.com'
const API_VERSION = '2024-01'
const ADMIN_API_URL = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`
const OAUTH_URL = `https://${SHOPIFY_STORE}/admin/oauth/access_token`

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: Set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET env vars before running.')
  process.exit(1)
}

async function getAdminToken() {
  console.log('Getting admin token via client_credentials...')
  const res = await fetch(OAUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OAuth failed (${res.status}): ${body}`)
  }

  const json = await res.json()
  if (!json.access_token) throw new Error('No access_token in OAuth response')
  console.log('Admin token acquired.')
  return json.access_token
}

async function adminGraphQL(adminToken, query, variables = {}) {
  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Admin API error (${res.status}): ${body}`)
  }

  return res.json()
}

async function main() {
  const adminToken = await getAdminToken()

  // 1. List all existing storefront tokens
  console.log('\nListing existing storefront tokens...')
  const listResult = await adminGraphQL(adminToken, `
    query {
      storefrontAccessTokens(first: 100) {
        edges { node { id title } }
      }
    }
  `)

  const tokens = listResult.data?.storefrontAccessTokens?.edges ?? []
  console.log(`Found ${tokens.length} token(s).`)

  // 2. Delete each one
  for (const { node } of tokens) {
    console.log(`  Deleting: ${node.id} ("${node.title}")`)
    const delResult = await adminGraphQL(
      adminToken,
      `mutation DeleteToken($id: ID!) {
        storefrontAccessTokenDelete(input: { id: $id }) {
          deletedStorefrontAccessTokenId
          userErrors { field message }
        }
      }`,
      { id: node.id },
    )
    const errs = delResult.data?.storefrontAccessTokenDelete?.userErrors
    if (errs?.length) console.warn('  Delete errors:', JSON.stringify(errs))
    else console.log('  Deleted.')
  }

  // 3. Create a fresh storefront token
  console.log('\nCreating new storefront token "Salt & Stone AU Headless"...')
  const createResult = await adminGraphQL(adminToken, `
    mutation {
      storefrontAccessTokenCreate(input: { title: "Salt & Stone AU Headless" }) {
        storefrontAccessToken { accessToken title }
        userErrors { field message }
      }
    }
  `)

  const createErrs = createResult.data?.storefrontAccessTokenCreate?.userErrors
  if (createErrs?.length) {
    console.error('Create errors:', JSON.stringify(createErrs))
    process.exit(1)
  }

  const newToken = createResult.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken
  if (!newToken) {
    console.error('No accessToken in response:', JSON.stringify(createResult))
    process.exit(1)
  }

  console.log('\n✓ New storefront token created successfully.')
  console.log('━'.repeat(60))
  console.log('SHOPIFY_STOREFRONT_TOKEN=' + newToken)
  console.log('━'.repeat(60))
  console.log('\nAdd the above to your Vercel environment variables.')
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
