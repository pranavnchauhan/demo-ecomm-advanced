import { execSync } from 'child_process'
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const root = '/vercel/share/v0-project'

// 1. Check if node_modules exists
console.log('=== node_modules check ===')
const nmExists = existsSync(join(root, 'node_modules'))
console.log('node_modules exists:', nmExists)
if (nmExists) {
  const nmDirs = readdirSync(join(root, 'node_modules')).filter(d => !d.startsWith('.')).length
  console.log('packages count:', nmDirs)
}

// 2. Check key dependencies
const deps = ['next', 'react', 'react-dom', 'swr', 'lucide-react', '@radix-ui/react-dialog']
for (const dep of deps) {
  const depPath = join(root, 'node_modules', dep)
  console.log(`  ${dep}: ${existsSync(depPath) ? 'OK' : 'MISSING'}`)
}

// 3. Check for any remaining stripe references
console.log('\n=== Stripe references check ===')
try {
  const result = execSync(`grep -rl "from.*stripe\\|require.*stripe" ${root}/app ${root}/components ${root}/lib 2>/dev/null || echo "NONE FOUND"`, { encoding: 'utf8' })
  console.log(result.trim())
} catch (e) {
  console.log('No stripe references found')
}

// 4. Try to compile a simple TypeScript import check
console.log('\n=== Import resolution check ===')
const tsconfig = join(root, 'tsconfig.json')
if (existsSync(tsconfig)) {
  const tc = JSON.parse(readFileSync(tsconfig, 'utf8'))
  console.log('tsconfig paths:', JSON.stringify(tc.compilerOptions?.paths || 'none'))
}

// 5. Check if there's a .next directory (build cache)
const nextDir = join(root, '.next')
console.log('\n=== .next cache ===')
console.log('.next exists:', existsSync(nextDir))

// 6. Check for any TypeScript errors by trying to parse key files
console.log('\n=== File check: all tsx/ts in app/ ===')
function findFiles(dir, ext, results = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
        findFiles(full, ext, results)
      } else if (entry.name.endsWith(ext)) {
        results.push(full)
      }
    }
  } catch {}
  return results
}

const allTsx = [
  ...findFiles(join(root, 'app'), '.tsx'),
  ...findFiles(join(root, 'app'), '.ts'),
  ...findFiles(join(root, 'components'), '.tsx'),
  ...findFiles(join(root, 'components'), '.ts'),
  ...findFiles(join(root, 'lib'), '.ts'),
]

console.log('Total ts/tsx files:', allTsx.length)

// Check each file for imports that reference deleted files
const importRegex = /from\s+["'](@\/[^"']+)["']/g
const brokenImports = []
for (const file of allTsx) {
  const content = readFileSync(file, 'utf8')
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1].replace('@/', '')
    // Check if the imported file exists
    const candidates = [
      join(root, importPath + '.ts'),
      join(root, importPath + '.tsx'),
      join(root, importPath, 'index.ts'),
      join(root, importPath, 'index.tsx'),
    ]
    const found = candidates.some(c => existsSync(c))
    if (!found) {
      brokenImports.push({ file: file.replace(root + '/', ''), import: match[1] })
    }
  }
}

if (brokenImports.length > 0) {
  console.log('\n=== BROKEN IMPORTS FOUND ===')
  for (const bi of brokenImports) {
    console.log(`  ${bi.file} imports "${bi.import}" -> FILE NOT FOUND`)
  }
} else {
  console.log('\nAll @/ imports resolve correctly')
}

// 7. Check for pnpm-lock.yaml
console.log('\n=== Lock file ===')
console.log('pnpm-lock.yaml exists:', existsSync(join(root, 'pnpm-lock.yaml')))

// 8. Try actually running next build check
console.log('\n=== Dev server port check ===')
try {
  const ports = execSync('ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null || echo "cannot check ports"', { encoding: 'utf8' })
  const lines = ports.split('\n').filter(l => l.includes('3000') || l.includes('3001'))
  console.log('Port 3000/3001:', lines.length > 0 ? lines.join('\n') : 'NOT LISTENING')
} catch {
  console.log('Cannot check ports')
}
