// Generates PWA icons (Ticket 8, SPEC §7's "icon/splash should use the
// category-color system, not a generic placeholder"). The four-point star
// is both books' own bullet glyph (✴, per the extraction legends in
// content/*.md) on Ironsworn's dark accent, filled with a gradient sweeping
// through several of Starforged's category colors — not invented, both
// pulled straight from the existing tokens.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(rootDir, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const BG = '#30393D' // ironswornTokens.barDark
const GRADIENT_STOPS = [
  { offset: '0%', color: '#3F8C8A' }, // starforgedCategoryColors.session
  { offset: '25%', color: '#206087' }, // .adventure
  { offset: '50%', color: '#805A90' }, // .quest
  { offset: '75%', color: '#8F477B' }, // .fate
  { offset: '100%', color: '#883529' }, // .suffer
]

function starPath(cx, cy, outerR, innerR) {
  return [
    `M ${cx} ${cy - outerR}`,
    `L ${cx + innerR} ${cy - innerR}`,
    `L ${cx + outerR} ${cy}`,
    `L ${cx + innerR} ${cy + innerR}`,
    `L ${cx} ${cy + outerR}`,
    `L ${cx - innerR} ${cy + innerR}`,
    `L ${cx - outerR} ${cy}`,
    `L ${cx - innerR} ${cy - innerR}`,
    'Z',
  ].join(' ')
}

function gradientDefs() {
  const stops = GRADIENT_STOPS.map(
    (s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`,
  ).join('')
  return `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient>`
}

// Standard icon: rounded square, star fills most of the canvas.
function standardSvg() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDefs()}</defs>
  <rect width="512" height="512" rx="96" fill="${BG}"/>
  <path d="${starPath(256, 256, 196, 40)}" fill="url(#g)"/>
</svg>`
}

// Maskable icon: full-bleed background (OS applies its own mask shape), star
// scaled down to stay inside the ~80% "safe zone" so it isn't clipped.
function maskableSvg() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDefs()}</defs>
  <rect width="512" height="512" fill="${BG}"/>
  <path d="${starPath(256, 256, 160, 33)}" fill="url(#g)"/>
</svg>`
}

const standard = standardSvg()
const maskable = maskableSvg()

writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), standard)

const targets = [
  { svg: standard, file: 'icon-192.png', size: 192 },
  { svg: standard, file: 'icon-512.png', size: 512 },
  { svg: maskable, file: 'icon-512-maskable.png', size: 512 },
  { svg: standard, file: 'apple-touch-icon.png', size: 180 },
]

for (const { svg, file, size } of targets) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outDir, file))
}

console.log(`Generated ${targets.length} icons in public/icons/ + public/favicon.svg`)
