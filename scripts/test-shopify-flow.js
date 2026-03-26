// Test the exact same flow the shopify lib uses:
// 1. Use SHOPIFY_ADMIN_CLIENT_SECRET as direct Admin API token
// 2. List existing storefront access tokens
// 3. Use one to make a Storefront API query

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace('https://', '').replace('http://', '').replace(/\/$/, '')
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_CLIENT_SECRET

console.log('Store domain:', STORE_DOMAIN)
console.log('Admin token present:', !!ADMIN_TOKEN)

if (!ADMIN_TOKEN || !STORE_DOMAIN) {
  console.log('MISSING ENV VARS')
  process.exit(1)
}

const ADMIN_URL = `https://${STORE_DOMAIN}/admin/api/2024-10/graphql.json`
const STOREFRONT_URL = `https://${STORE_DOMAIN}/api/2024-10/graphql.json`

async function test() {
  // Step 1: Test Admin API with direct token
  console.log('\n--- Step 1: Admin API ---')
  const adminRes = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({
      query: `{ storefrontAccessTokens(first: 5) { edges { node { accessToken title } } } }`,
    }),
  })
  console.log('Admin status:', adminRes.status)
  const adminJson = await adminRes.json()
  console.log('Admin response:', JSON.stringify(adminJson, null, 2))

  const tokens = adminJson.data?.storefrontAccessTokens?.edges
  if (!tokens || tokens.length === 0) {
    console.log('No storefront tokens found. Creating one...')
    const createRes = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: `mutation { storefrontAccessTokenCreate(input: { title: "Salt & Stone AU Headless" }) { storefrontAccessToken { accessToken } userErrors { message } } }`,
      }),
    })
    const createJson = await createRes.json()
    console.log('Create response:', JSON.stringify(createJson, null, 2))
    return
  }

  const sfToken = tokens[0].node.accessToken
  console.log('Storefront token:', sfToken.substring(0, 8) + '...')

  // Step 2: Test Storefront API
  console.log('\n--- Step 2: Storefront API ---')
  const sfRes = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': sfToken,
    },
    body: JSON.stringify({
      query: `{ products(first: 5) { edges { node { title handle } } } }`,
    }),
  })
  console.log('Storefront status:', sfRes.status)
  const sfJson = await sfRes.json()
  console.log('Storefront response:', JSON.stringify(sfJson, null, 2))
}

test().catch(console.error)
