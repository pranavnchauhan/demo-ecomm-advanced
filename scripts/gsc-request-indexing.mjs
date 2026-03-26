import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const keyPath = resolve(__dirname, '..', 'gsc-service-account.json')
const key = JSON.parse(readFileSync(keyPath, 'utf8'))

const SITE_URL = 'sc-domain:saltandstone.com.au'

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/indexing',
  ],
})

const searchconsole = google.searchconsole({ version: 'v1', auth })
const indexing = google.indexing({ version: 'v3', auth })

// All pages that should be indexed
const PAGES_TO_INDEX = [
  'https://www.saltandstone.com.au/',
  'https://www.saltandstone.com.au/shop',
  'https://www.saltandstone.com.au/about',
  'https://www.saltandstone.com.au/blog',
  'https://www.saltandstone.com.au/quiz',
  'https://www.saltandstone.com.au/faq',
  'https://www.saltandstone.com.au/contact',
  // Collections
  'https://www.saltandstone.com.au/collections/bath-salts',
  'https://www.saltandstone.com.au/collections/body-scrubs',
  'https://www.saltandstone.com.au/collections/essential-oils',
  'https://www.saltandstone.com.au/collections/candles',
  'https://www.saltandstone.com.au/collections/hand-wash',
  // Blog posts
  'https://www.saltandstone.com.au/blog/calming-bath-ritual-at-home',
  'https://www.saltandstone.com.au/blog/why-australians-switching-natural-body-care',
  'https://www.saltandstone.com.au/blog/history-of-bath-salts-ancient-to-modern',
  'https://www.saltandstone.com.au/blog/essential-oils-vs-fragrance-oils',
  'https://www.saltandstone.com.au/blog/guide-to-exfoliation-body-scrubs',
  'https://www.saltandstone.com.au/blog/choosing-the-right-soy-candle',
  'https://www.saltandstone.com.au/blog/australian-botanicals-in-body-care',
  'https://www.saltandstone.com.au/blog/simple-self-care-rituals',
  // Policies
  'https://www.saltandstone.com.au/policies/shipping',
  'https://www.saltandstone.com.au/policies/returns',
  'https://www.saltandstone.com.au/policies/privacy',
  'https://www.saltandstone.com.au/policies/terms',
]

async function run() {
  // Method 1: Try Indexing API (URL_UPDATED notifications)
  console.log('=== Requesting indexing via Indexing API ===\n')
  let indexingApiWorked = false

  for (const url of PAGES_TO_INDEX) {
    try {
      const result = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      })
      console.log(`✓ ${url} — ${result.data.urlNotificationMetadata?.latestUpdate?.type || 'submitted'}`)
      indexingApiWorked = true
    } catch (e) {
      const msg = e.message || ''
      if (msg.includes('Permission denied') || msg.includes('403') || msg.includes('Indexing API')) {
        if (!indexingApiWorked) {
          console.log(`✗ Indexing API not available (needs Indexing API enabled + owner-level access)`)
          console.log(`  Falling back to URL inspection method...\n`)
          break
        }
      }
      console.log(`✗ ${url} — ${msg}`)
    }
  }

  // Method 2: Inspect each URL (this at least triggers Google to notice them)
  if (!indexingApiWorked) {
    console.log('=== Inspecting URLs (triggers Google to re-evaluate) ===\n')
    for (const url of PAGES_TO_INDEX) {
      try {
        const result = await searchconsole.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: url,
            siteUrl: SITE_URL,
          },
        })
        const coverage = result.data.inspectionResult?.indexStatusResult
        const state = coverage?.coverageState || 'unknown'
        const verdict = coverage?.verdict || '?'
        console.log(`${verdict === 'PASS' ? '✓' : '○'} ${url}`)
        console.log(`  Status: ${state} | Verdict: ${verdict}`)
      } catch (e) {
        console.log(`✗ ${url} — ${e.message}`)
      }
    }
  }

  // Verify sitemap is submitted
  console.log('\n=== Sitemap check ===')
  const webmasters = google.webmasters({ version: 'v3', auth: new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  }) })

  try {
    const sitemaps = await webmasters.sitemaps.list({ siteUrl: SITE_URL })
    const existing = sitemaps.data.sitemap?.map(s => s.path) || []

    if (!existing.includes('https://www.saltandstone.com.au/sitemap.xml')) {
      console.log('Submitting sitemap...')
      await webmasters.sitemaps.submit({
        siteUrl: SITE_URL,
        feedpath: 'https://www.saltandstone.com.au/sitemap.xml',
      })
      console.log('✓ Sitemap submitted: https://www.saltandstone.com.au/sitemap.xml')
    } else {
      console.log('✓ Sitemap already submitted: https://www.saltandstone.com.au/sitemap.xml')
      // Re-submit to force refresh
      await webmasters.sitemaps.submit({
        siteUrl: SITE_URL,
        feedpath: 'https://www.saltandstone.com.au/sitemap.xml',
      })
      console.log('✓ Sitemap re-submitted to force refresh')
    }
  } catch (e) {
    console.log(`Sitemap error: ${e.message}`)
  }
}

run().catch(console.error)
