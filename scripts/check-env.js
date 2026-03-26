// Check Supabase + Stripe env vars
const checks = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'POSTGRES_URL',
  'STRIPE_MODE',
  'STRIPE_SECRET_KEY',
  'STRIPE_TEST_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_TEST_PUBLISHABLE_KEY',
]

for (const v of checks) {
  const val = process.env[v]
  if (!val) {
    console.log(`${v} = NOT SET`)
  } else if (v === 'NEXT_PUBLIC_SUPABASE_URL') {
    console.log(`${v} = ${val}`)
  } else if (v === 'POSTGRES_URL') {
    const host = val.split('@')[1]?.split('/')[0] || 'unknown'
    console.log(`${v} host = ${host}`)
  } else {
    console.log(`${v} = ${val.substring(0, 10)}... (length: ${val.length})`)
  }
}
