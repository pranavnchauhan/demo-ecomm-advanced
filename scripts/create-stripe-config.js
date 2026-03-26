import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.POSTGRES_URL });

async function main() {
  await client.connect();
  console.log('Connected to Postgres');

  // Create site_config table
  await client.query(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      is_secret BOOLEAN DEFAULT false,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log('Created site_config table');

  // Insert default config rows (skip if already exist)
  const rows = [
    { key: 'stripe_mode', value: 'test', is_secret: false },
    { key: 'stripe_live_publishable_key', value: '', is_secret: false },
    { key: 'stripe_live_secret_key', value: '', is_secret: true },
    { key: 'stripe_test_publishable_key', value: '', is_secret: false },
    { key: 'stripe_test_secret_key', value: '', is_secret: true },
  ];

  for (const row of rows) {
    await client.query(
      `INSERT INTO site_config (key, value, is_secret)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO NOTHING`,
      [row.key, row.value, row.is_secret]
    );
  }
  console.log('Inserted default config rows');

  // Enable RLS
  await client.query(`ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;`);

  // Drop existing policies first to avoid conflicts
  await client.query(`DROP POLICY IF EXISTS "Public can read non-secret config" ON site_config;`);

  // Allow public reads of non-secret keys (publishable keys + mode)
  await client.query(`
    CREATE POLICY "Public can read non-secret config"
      ON site_config FOR SELECT
      USING (is_secret = false);
  `);
  console.log('RLS enabled - secret keys protected');

  // Show current config
  const result = await client.query(`SELECT key, is_secret FROM site_config ORDER BY key`);
  console.log('Config rows:', result.rows);

  await client.end();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
