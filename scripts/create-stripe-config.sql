-- Create site_config table for storing Stripe keys and other config
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Stripe mode (default to 'test')
INSERT INTO site_config (key, value) VALUES ('stripe_mode', 'test')
ON CONFLICT (key) DO NOTHING;

-- Placeholder rows for keys (will be updated by the user)
INSERT INTO site_config (key, value) VALUES ('stripe_live_publishable_key', '')
ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stripe_live_secret_key', '')
ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stripe_test_publishable_key', '')
ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('stripe_test_secret_key', '')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read of non-secret keys (publishable key + mode only)
CREATE POLICY "Allow public read of non-secret config" ON site_config
  FOR SELECT
  USING (key IN ('stripe_mode', 'stripe_live_publishable_key', 'stripe_test_publishable_key'));

-- Allow service role full access (for server-side reading of secret keys)
CREATE POLICY "Allow service role full access" ON site_config
  FOR ALL
  USING (true)
  WITH CHECK (true);
