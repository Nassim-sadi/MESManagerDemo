/**
 * Verifies that every PrimeIcons class used in the sources exists in the
 * installed primeicons package. A missing icon silently renders nothing,
 * which is easy to miss in a screenshot review.
 *
 * Usage: npm run check:icons
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC_DIR = 'src'
const ICON_CSS = 'node_modules/primeicons/primeicons.css'

function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return collectFiles(path)
    return /\.vue$|\.ts$/.test(entry.name) ? [path] : []
  })
}

const css = readFileSync(ICON_CSS, 'utf8')
const missing = []

for (const file of collectFiles(SRC_DIR)) {
  const content = readFileSync(file, 'utf8')
  for (const match of content.matchAll(/\bpi pi-([a-z0-9-]+)/g)) {
    const name = match[1]
    if (!css.includes(`.pi-${name}:before`)) {
      missing.push(`${relative('.', file)} -> pi-${name}`)
    }
  }
}

if (missing.length) {
  console.error('Unknown PrimeIcons classes:')
  for (const entry of [...new Set(missing)]) console.error(`  ${entry}`)
  process.exit(1)
}

console.log('All PrimeIcons classes exist.')
