import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const keyPath = resolve(__dirname, '..', 'gsc-service-account.json')
const key = JSON.parse(readFileSync(keyPath, 'utf8'))

const SITE_URL = 'https://www.saltandstone.com.au/'
// Also try sc-domain: format if URL prefix doesn't work
const SITE_URL_DOMAIN = 'sc-domain:saltandstone.com.au'

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})

const searchconsole = google.searchconsole({ version: 'v1', auth })
const webmasters = google.webmasters({ version: 'v3', auth })

async function run() {
  // 1. List available sites to confirm access
  console.log('=== AVAILABLE SITES ===')
  try {
    const sites = await webmasters.sites.list()
    console.log(JSON.stringify(sites.data, null, 2))
  } catch (e) {
    console.log('Error listing sites:', e.message)
  }

  // Determine which site URL works
  let siteUrl = SITE_URL
  try {
    await webmasters.sites.get({ siteUrl: SITE_URL })
    console.log(`\nUsing URL-prefix property: ${SITE_URL}`)
  } catch {
    try {
      await webmasters.sites.get({ siteUrl: SITE_URL_DOMAIN })
      siteUrl = SITE_URL_DOMAIN
      console.log(`\nUsing domain property: ${SITE_URL_DOMAIN}`)
    } catch (e2) {
      console.log('\nCould not access either property format:', e2.message)
      return
    }
  }

  // 2. Check sitemaps
  console.log('\n=== SITEMAPS ===')
  try {
    const sitemaps = await webmasters.sitemaps.list({ siteUrl })
    if (sitemaps.data.sitemap?.length) {
      sitemaps.data.sitemap.forEach(s => {
        console.log(`${s.path} — ${s.isPending ? 'PENDING' : 'processed'} — ${s.contents?.[0]?.submitted || '?'} submitted, ${s.contents?.[0]?.indexed || '?'} indexed`)
      })
    } else {
      console.log('No sitemaps found! Need to submit one.')
    }
  } catch (e) {
    console.log('Error fetching sitemaps:', e.message)
  }

  // 3. Index coverage / URL inspection (sample key pages)
  console.log('\n=== URL INSPECTION (key pages) ===')
  const keyPages = [
    'https://www.saltandstone.com.au/',
    'https://www.saltandstone.com.au/shop',
    'https://www.saltandstone.com.au/about',
    'https://www.saltandstone.com.au/blog',
    'https://www.saltandstone.com.au/quiz',
    'https://www.saltandstone.com.au/faq',
    'https://www.saltandstone.com.au/contact',
    'https://www.saltandstone.com.au/collections/bath-salts',
    'https://www.saltandstone.com.au/collections/body-scrubs',
    'https://www.saltandstone.com.au/blog/calming-bath-ritual-at-home',
    'https://www.saltandstone.com.au/blog/essential-oils-vs-fragrance-oils',
  ]

  for (const url of keyPages) {
    try {
      const result = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl,
        },
      })
      const r = result.data.inspectionResult
      const coverage = r?.indexStatusResult
      console.log(`${url}`)
      console.log(`  Coverage: ${coverage?.coverageState || 'unknown'}`)
      console.log(`  Verdict: ${coverage?.verdict || 'unknown'}`)
      console.log(`  Indexing: ${coverage?.indexingState || 'unknown'}`)
      console.log(`  Last crawl: ${coverage?.lastCrawlTime || 'never'}`)
      if (coverage?.pageFetchState) console.log(`  Fetch: ${coverage.pageFetchState}`)
      if (coverage?.robotsTxtState) console.log(`  Robots: ${coverage.robotsTxtState}`)
      console.log()
    } catch (e) {
      console.log(`${url} — Error: ${e.message}\n`)
    }
  }

  // 4. Search performance (last 28 days)
  console.log('\n=== SEARCH PERFORMANCE (last 28 days) ===')
  try {
    const perf = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: getDateString(-28),
        endDate: getDateString(-1),
        dimensions: ['page'],
        rowLimit: 25,
      },
    })
    if (perf.data.rows?.length) {
      console.log('Page | Clicks | Impressions | CTR | Position')
      console.log('-'.repeat(90))
      perf.data.rows.forEach(row => {
        const page = row.keys[0].replace('https://www.saltandstone.com.au', '')
        console.log(`${page || '/'} | ${row.clicks} | ${row.impressions} | ${(row.ctr * 100).toFixed(1)}% | ${row.position.toFixed(1)}`)
      })
    } else {
      console.log('No search performance data yet.')
    }
  } catch (e) {
    console.log('Error fetching performance:', e.message)
  }

  // 5. Top queries
  console.log('\n=== TOP QUERIES (last 28 days) ===')
  try {
    const queries = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: getDateString(-28),
        endDate: getDateString(-1),
        dimensions: ['query'],
        rowLimit: 25,
      },
    })
    if (queries.data.rows?.length) {
      console.log('Query | Clicks | Impressions | CTR | Position')
      console.log('-'.repeat(90))
      queries.data.rows.forEach(row => {
        console.log(`${row.keys[0]} | ${row.clicks} | ${row.impressions} | ${(row.ctr * 100).toFixed(1)}% | ${row.position.toFixed(1)}`)
      })
    } else {
      console.log('No query data yet.')
    }
  } catch (e) {
    console.log('Error fetching queries:', e.message)
  }
}

function getDateString(daysOffset) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().split('T')[0]
}

run().catch(console.error)
