/**
 * Push product images from our image registry to Shopify via Admin API.
 *
 * For each product:
 *   1. Cutout (white bg, primary product image)
 *   2. Styled front (product with ingredients on linen)
 *   3. Lifestyle (product in use)
 *   4. Ingredient (raw ingredient close-up)
 *   5. Scale (hand-held / size reference)
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'salt-and-stone-au.myshopify.com'
const CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID
const CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET

const OAUTH_URL = `https://${STORE_DOMAIN}/admin/oauth/access_token`
const ADMIN_API_URL = `https://${STORE_DOMAIN}/admin/api/2025-07/graphql.json`

// ── Image mapping: product handle -> ordered image URLs ──
// Add product handles and image URLs when products are set up in Shopify
const PRODUCT_IMAGES = {}

// ── Step 1: Get Admin API token ──
async function getAdminToken() {
  console.log('Step 1: Getting Admin API token...')
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
  console.log('  Got admin token')
  return json.access_token
}

// ── Step 2: Fetch all products to get their GIDs ──
async function getProducts(adminToken) {
  console.log('Step 2: Fetching products...')
  const query = `{
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          media(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  id
                  image { url }
                }
              }
            }
          }
        }
      }
    }
  }`

  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query }),
  })

  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))

  const products = json.data.products.edges.map(e => e.node)
  for (const p of products) {
    const mediaCount = p.media.edges.length
    console.log(`  ${p.title} (${p.handle}) - ${mediaCount} existing images`)
  }
  return products
}

// ── Step 3: Push images to a product ──
async function pushImagesToProduct(adminToken, productGid, images, productTitle) {
  console.log(`\nPushing ${images.length} images to "${productTitle}"...`)

  // Use productCreateMedia to add images from URLs
  const media = images.map(img => ({
    originalSource: img.url,
    alt: img.alt,
    mediaContentType: 'IMAGE',
  }))

  const mutation = `
    mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          ... on MediaImage {
            id
            status
            image { url }
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `

  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { productId: productGid, media },
    }),
  })

  const json = await res.json()

  if (json.errors) {
    console.log(`  ERROR: ${JSON.stringify(json.errors)}`)
    return false
  }

  const result = json.data.productCreateMedia
  if (result.mediaUserErrors?.length > 0) {
    console.log(`  USER ERRORS: ${JSON.stringify(result.mediaUserErrors)}`)
    return false
  }

  const created = result.media?.length || 0
  console.log(`  Successfully queued ${created} images for processing`)
  return true
}

// ── Main ──
async function main() {
  console.log('=== Pushing Product Images to Shopify ===\n')
  console.log(`Store: ${STORE_DOMAIN}`)
  console.log(`Products to update: ${Object.keys(PRODUCT_IMAGES).length}\n`)

  const token = await getAdminToken()
  const products = await getProducts(token)

  let success = 0
  let skipped = 0

  for (const product of products) {
    const images = PRODUCT_IMAGES[product.handle]
    if (!images) {
      console.log(`\nSkipping "${product.title}" - no images mapped for handle "${product.handle}"`)
      skipped++
      continue
    }

    // Skip if product already has images
    if (product.media.edges.length > 0) {
      console.log(`\nSkipping "${product.title}" - already has ${product.media.edges.length} images`)
      skipped++
      continue
    }

    const ok = await pushImagesToProduct(token, product.id, images, product.title)
    if (ok) success++

    // Small delay between products to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\n=== Done ===`)
  console.log(`Successfully pushed images to ${success} product(s)`)
  console.log(`Skipped ${skipped} product(s)`)
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
