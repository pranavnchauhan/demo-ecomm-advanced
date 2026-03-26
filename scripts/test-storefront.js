// Test using SHOPIFY_CLIENT_ID as the Storefront API public access token
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
const clientId = process.env.SHOPIFY_CLIENT_ID || ''

console.log('Domain:', domain)
console.log('Client ID (first 8 chars):', clientId.substring(0, 8) + '...')

const STOREFRONT_URL = `https://${domain}/api/2024-10/graphql.json`

async function testStorefrontWithClientId() {
  // Method 1: Client ID as X-Shopify-Storefront-Access-Token
  console.log('\n--- Method 1: Client ID as X-Shopify-Storefront-Access-Token ---')
  try {
    const res = await fetch(STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': clientId,
      },
      body: JSON.stringify({
        query: `{ products(first: 5) { edges { node { title handle priceRange { minVariantPrice { amount currencyCode } } variants(first: 5) { edges { node { id title price { amount currencyCode } } } } } } } }`
      }),
    })
    const text = await res.text()
    console.log('Status:', res.status)
    try {
      const json = JSON.parse(text)
      console.log('Response:', JSON.stringify(json, null, 2))
    } catch {
      console.log('Raw:', text.substring(0, 500))
    }
  } catch (e) {
    console.log('Error:', e.message)
  }

  // Method 2: Shopify-Storefront-Private-Token header
  console.log('\n--- Method 2: Shopify-Storefront-Private-Token ---')
  try {
    const res = await fetch(STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': clientId,
      },
      body: JSON.stringify({
        query: `{ products(first: 5) { edges { node { title handle priceRange { minVariantPrice { amount currencyCode } } } } } }`
      }),
    })
    const text = await res.text()
    console.log('Status:', res.status)
    try {
      const json = JSON.parse(text)
      console.log('Response:', JSON.stringify(json, null, 2))
    } catch {
      console.log('Raw:', text.substring(0, 500))
    }
  } catch (e) {
    console.log('Error:', e.message)
  }

  // Method 3: Delegate access token endpoint
  console.log('\n--- Method 3: Delegate access token ---')
  try {
    const tokenUrl = `https://${domain}/admin/oauth/access_token`
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET || '',
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        subject_token: clientId,
        requested_token_type: 'urn:shopify:params:oauth:token-type:offline-access-token',
      }),
    })
    const text = await res.text()
    console.log('Status:', res.status)
    console.log('Response:', text.substring(0, 500))
  } catch (e) {
    console.log('Error:', e.message)
  }
}

testStorefrontWithClientId()
