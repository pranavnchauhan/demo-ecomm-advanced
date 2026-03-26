const fs = await import("fs");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const sql = fs.readFileSync("/vercel/share/v0-project/scripts/001_create_tables.sql", "utf-8");

// Split into individual statements
const statements = sql
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

console.log(`Found ${statements.length} SQL statements to execute`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 80).replace(/\n/g, " ");
  console.log(`\n[${i + 1}/${statements.length}] ${preview}...`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: stmt,
    }),
  });

  // Use the SQL endpoint instead
  const sqlRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: stmt }),
  });

  if (!sqlRes.ok) {
    const text = await sqlRes.text();
    console.log(`  Warning: ${sqlRes.status} - will try direct approach`);
  } else {
    console.log(`  OK`);
  }
}

console.log("\nMigration attempt complete. Tables may need to be created via Supabase dashboard SQL editor.");
console.log("Copy the SQL from scripts/001_create_tables.sql and run it in your Supabase SQL Editor.");
