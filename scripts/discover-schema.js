// Discover existing tables in the Lovable Supabase project
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function discover() {
  // List all tables via PostgREST root endpoint (returns OpenAPI schema)
  const schemaResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Accept': 'application/openapi+json',
    },
  })

  if (schemaResponse.ok) {
    const schema = await schemaResponse.json()
    const tables = Object.keys(schema.paths || {})
      .filter(p => p !== '/')
      .map(p => p.replace('/', ''))
    console.log('\n=== EXISTING TABLES ===')
    console.log(JSON.stringify(tables, null, 2))

    // For each table, get column details
    if (schema.definitions) {
      console.log('\n=== TABLE SCHEMAS ===')
      for (const [tableName, def] of Object.entries(schema.definitions)) {
        console.log(`\n--- ${tableName} ---`)
        if (def.properties) {
          for (const [col, details] of Object.entries(def.properties)) {
            const type = details.format || details.type || 'unknown'
            const desc = details.description ? ` (${details.description})` : ''
            console.log(`  ${col}: ${type}${desc}`)
          }
        }
      }
    }
  } else {
    console.log('Schema response status:', schemaResponse.status)
    const text = await schemaResponse.text()
    console.log('Response:', text.substring(0, 500))
  }
}

discover().catch(console.error)
