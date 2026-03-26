import { execSync } from 'child_process';

try {
  console.log('Running pnpm install...');
  const result = execSync('cd /vercel/share/v0-project && pnpm install', {
    encoding: 'utf-8',
    timeout: 120000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  console.log(result);
  console.log('pnpm install completed successfully');
} catch (err) {
  console.error('pnpm install failed:', err.stderr || err.message);
  console.log('stdout:', err.stdout);
}
