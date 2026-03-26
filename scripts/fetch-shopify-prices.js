/**
 * Fetch product prices from Shopify Admin REST API.
 * For custom apps: the Admin API access token is needed.
 * 
 * Let's try multiple auth methods to see which one works:
 * 1. Client Secret as Admin API token (X-Shopify-Access-Token header)
 * 2. Basic auth with API key + password
 * 3. Client ID + Secret as basic auth
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''

// Clean the domain
const domain = STORE_DOMAIN.replace('https://', '').replace('http://', '').replace(/\/$/, '')

console.log('Store domain:', domain)
console.log('Client ID present:', !!CLIENT_ID)
console.log('Client Secret present:', !!CLIENT_SECRET)

async function tryFetch(label, url, headers) {
  console.log(`\n--- Trying: ${label} ---`)
  console.log('URL:', url)
  try {
    const res = await fetch(url, { headers })
    console.log('Status:', res.status)
    const text = await res.text()
    if (res.ok) {
      const data = JSON.parse(text)
      console.log('SUCCESS! Products found:', data.products?.length || 0)
      if (data.products) {
        for (const p of data.products) {
          console.log(`  - ${p.title}: ${p.variants?.[0]?.price || 'no price'} ${p.variants?.[0]?.currency || ''}`)
        }
      }
      return data
    } else {
      // Truncate HTML responses
      const short = text.length > 200 ? text.substring(0, 200) + '...' : text
      console.log('Failed:', short)
    }
  } catch (e) {
    console.log('Error:', e.message)
  }
  return null
}

// Method 1: X-Shopify-Access-Token header with Client Secret
await tryFetch(
  'Admin API with Client Secret as access token',
  `https://${domain}/admin/api/2024-01/products.json`,
  { 'X-Shopify-Access-Token': CLIENT_SECRET, 'Content-Type': 'application/json' }
)

// Method 2: X-Shopify-Access-Token header with Client ID
await tryFetch(
  'Admin API with Client ID as access token',
  `https://${domain}/admin/api/2024-01/products.json`,
  { 'X-Shopify-Access-Token': CLIENT_ID, 'Content-Type': 'application/json' }
)

// Method 3: Basic Auth with Client ID:Secret
const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
await tryFetch(
  'Admin API with Basic Auth (ClientID:Secret)',
  `https://${domain}/admin/api/2024-01/products.json`,
  { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/json' }
)

// Method 4: URL-embedded credentials
await tryFetch(
  'Admin API with URL credentials',
  `https://${CLIENT_ID}:${CLIENT_SECRET}@${domain}/admin/api/2024-01/products.json`,
  { 'Content-Type': 'application/json' }
)

console.log('\n--- Done ---')
