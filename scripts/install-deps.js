import { execSync } from "child_process"

console.log("Installing missing dependencies...")
try {
  execSync("cd /vercel/share/v0-project && pnpm add @supabase/ssr@0.6.1 @supabase/supabase-js@2.49.1 swr@2.3.3", {
    stdio: "inherit",
  })
  console.log("Dependencies installed successfully!")
} catch (e) {
  console.error("Install failed:", e.message)
}
