// Machine-translates src/data/en/*.generated.json into src/data/pt-BR/*.generated.json
// via Google Translate's free gtx endpoint. This is a PLACEHOLDER translation: the
// pt-BR files are committed so CI/dev builds work offline, and the whole point of the
// layout is that an official translation later just replaces those two files (see
// AGENTS.md / SPEC §6). Run with `pnpm content:translate` (needs network).
//
// Design notes:
// - {move:id} cross-ref tokens and **bold** markers survive gtx verbatim (verified);
//   every translation is validated for token/bold preservation and retried once with
//   placeholder substitution, falling back to the English line (with a warning) so a
//   flaky request never corrupts the output.
// - Translations are cached in scripts/translation-cache/pt-BR.json (committed), keyed
//   by the exact English line — re-runs after small content edits only re-translate
//   the changed lines.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const TARGET_LOCALE = 'pt-BR'
const GAMES = ['ironsworn', 'starforged']
const CONCURRENCY = 4
const MAX_LINE_CHARS = 1200 // keep gtx GET URLs well under practical limits
const CACHE_PATH = path.join(rootDir, 'scripts/translation-cache/pt-BR.json')

/** @type {Record<string, string>} */
const cache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, 'utf-8'))
  : {}
let cacheDirty = false

function saveCache() {
  if (!cacheDirty) return
  mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n')
  cacheDirty = false
}

function moveTokens(text) {
  return [...text.matchAll(/\{move:[a-z0-9-]+\}/g)].map((m) => m[0])
}

function isFaithful(source, translated) {
  const srcTokens = moveTokens(source)
  const dstTokens = moveTokens(translated)
  if (srcTokens.length !== dstTokens.length) return false
  if ([...srcTokens].sort().join() !== [...dstTokens].sort().join()) return false
  const boldCount = (s) => (s.match(/\*\*/g) ?? []).length
  return boldCount(source) === boldCount(translated)
}

async function gtx(text) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en' +
    `&tl=${encodeURIComponent(TARGET_LOCALE)}&dt=t&q=${encodeURIComponent(text)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`gtx HTTP ${response.status}`)
  const data = await response.json()
  return data[0].map((segment) => segment[0]).join('')
}

async function gtxWithRetry(text, attempts = 3) {
  let lastError
  for (let i = 0; i < attempts; i++) {
    try {
      return await gtx(text)
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** i))
    }
  }
  throw lastError
}

// Translates a single line, preserving {move:id} tokens and **bold** markers.
// Falls back to placeholder substitution ({0}, {1}…) if the direct translation
// scrambles a token; falls back to the English line if that also fails.
async function translateLine(line) {
  const cached = cache[line]
  if (cached !== undefined) return cached

  let translated
  try {
    translated = await gtxWithRetry(line)
    if (!isFaithful(line, translated)) {
      // Retry with each token swapped for a positional placeholder ({0}, {1}…),
      // then restore the tokens in order of the placeholders.
      const tokens = moveTokens(line)
      let i = 0
      const withPlaceholders = line.replace(/\{move:[a-z0-9-]+\}/g, () => `{${i++}}`)
      const retried = await gtxWithRetry(withPlaceholders)
      const restored = retried.replace(
        /\{(\d+)\}/g,
        (match, n) => tokens[Number(n)] ?? match,
      )
      translated = isFaithful(line, restored) ? restored : line
      if (translated === line) {
        console.warn(`  ! keeping English (token/bold mismatch): ${line.slice(0, 80)}…`)
      }
    }
  } catch (error) {
    console.warn(`  ! keeping English (${error.message}): ${line.slice(0, 80)}…`)
    translated = line
  }

  cache[line] = translated
  cacheDirty = true
  return translated
}

// Splits over-long single lines on sentence boundaries so gtx URLs stay short.
function splitLongLine(line) {
  if (line.length <= MAX_LINE_CHARS) return [line]
  const chunks = []
  let rest = line
  while (rest.length > MAX_LINE_CHARS) {
    let cut = rest.lastIndexOf('. ', MAX_LINE_CHARS)
    if (cut < MAX_LINE_CHARS / 2) cut = MAX_LINE_CHARS
    else cut += 1 // keep the period with its sentence
    chunks.push(rest.slice(0, cut))
    rest = rest.slice(cut).trimStart()
  }
  if (rest) chunks.push(rest)
  return chunks
}

// Tiny mechanical glossary applied AFTER the cache lookup (so tweaking it never
// invalidates cached translations). gtx leaves the "**Roll +stat**" formula in
// English; only the verb is translated here — stat names stay in English on
// purpose rather than guessing the official pt-BR terms, which the eventual
// official translation will bring.
function applyGlossary(text) {
  return text.replace(/\bRoll \+(?=[a-z])/g, 'Role +')
}

// Category names are keyed off the ENGLISH name (not the MT output) so they're
// deterministic. In pt-BR the buttons carry only the qualifier ("Sessão",
// "Combate", …) and the browse pane adds a "Movimentos de" label above the
// list (browse.categoryGroupLabel in ui.json) — gtx's "Movimentos de X" per
// button was long enough to wrap, and its phrasing was off besides ("Sofrer
// Movimentos"). The official translation will replace these wholesale anyway.
const CATEGORY_NAME_PTBR = {
  'Adventure Moves': 'Aventura',
  'Journey Moves': 'Jornada',
  'Scene Challenge Moves': 'Desafio de Cena',
  'Quest Moves': 'Missão',
  'Fate Moves': 'Destino',
  'Relationship Moves': 'Relacionamento',
  'Combat Moves': 'Combate',
  'Suffer Moves': 'Desgaste',
  'Delve Moves': 'Mergulho',
  'Failure Moves': 'Falha',
  'Threat Moves': 'Ameaça',
  'Rarity Moves': 'Raridade',
  'Session Moves': 'Sessão',
  'Connection Moves': 'Conexão',
  'Exploration Moves': 'Exploração',
  'Recover Moves': 'Recuperação',
  'Threshold Moves': 'Limite',
  'Legacy Moves': 'Legado',
}

// Collects every translatable line (multi-line fields are split on \n; each
// non-empty line is translated independently, which also maximizes cache reuse).
function collectLines(content, lines) {
  const addText = (text) => {
    for (const raw of text.split('\n')) {
      const line = raw.trim()
      if (line) for (const chunk of splitLongLine(line)) lines.add(chunk)
    }
  }
  for (const category of content.categories) addText(category.name)
  for (const move of content.moves) {
    addText(move.title)
    if (move.tag) addText(move.tag)
    addText(move.trigger)
    for (const option of move.rollOptions ?? []) addText(option)
    for (const bullet of move.bullets ?? []) addText(bullet)
    for (const text of Object.values(move.outcomes)) addText(text)
    for (const table of move.tables ?? []) {
      for (const header of table.headers) addText(header)
      for (const row of table.rows) for (const cell of row) addText(cell)
    }
    for (const sidebar of move.sidebars ?? []) {
      if (sidebar.title) addText(sidebar.title)
      addText(sidebar.body)
    }
  }
}

async function translateAll(lines) {
  const pending = [...lines].filter((line) => cache[line] === undefined)
  console.log(
    `${lines.size} unique lines, ${lines.size - pending.length} cached, ${pending.length} to translate.`,
  )
  let done = 0
  let index = 0
  const worker = async () => {
    while (index < pending.length) {
      const line = pending[index++]
      await translateLine(line)
      done++
      if (done % 25 === 0) {
        console.log(`  translated ${done}/${pending.length}`)
        saveCache()
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  saveCache()
}

function translateText(text) {
  return text
    .split('\n')
    .map((raw) => {
      const line = raw.trim()
      if (!line) return raw
      return splitLongLine(line)
        .map((chunk) => applyGlossary(cache[chunk] ?? chunk))
        .join(' ')
    })
    .join('\n')
}

function translateContent(content) {
  return {
    ...content,
    categories: content.categories.map((category) => ({
      ...category,
      name: CATEGORY_NAME_PTBR[category.name] ?? translateText(category.name),
    })),
    moves: content.moves.map((move) => ({
      ...move,
      title: translateText(move.title),
      ...(move.tag ? { tag: translateText(move.tag) } : {}),
      trigger: translateText(move.trigger),
      ...(move.rollOptions
        ? { rollOptions: move.rollOptions.map(translateText) }
        : {}),
      ...(move.bullets ? { bullets: move.bullets.map(translateText) } : {}),
      outcomes: Object.fromEntries(
        Object.entries(move.outcomes).map(([key, text]) => [key, translateText(text)]),
      ),
      ...(move.tables
        ? {
            tables: move.tables.map((table) => ({
              headers: table.headers.map(translateText),
              rows: table.rows.map((row) => row.map(translateText)),
            })),
          }
        : {}),
      ...(move.sidebars
        ? {
            sidebars: move.sidebars.map((sidebar) => ({
              ...(sidebar.title ? { title: translateText(sidebar.title) } : {}),
              body: translateText(sidebar.body),
            })),
          }
        : {}),
    })),
  }
}

async function build() {
  const outDir = path.join(rootDir, 'src/data/pt-BR')
  mkdirSync(outDir, { recursive: true })

  for (const game of GAMES) {
    const enPath = path.join(rootDir, `src/data/en/${game}.generated.json`)
    const content = JSON.parse(readFileSync(enPath, 'utf-8'))
    const lines = new Set()
    collectLines(content, lines)
    console.log(`\n[${game}]`)
    await translateAll(lines)
    const translated = translateContent(content)
    writeFileSync(
      path.join(outDir, `${game}.generated.json`),
      JSON.stringify(translated, null, 2) + '\n',
    )
    console.log(`Wrote src/data/pt-BR/${game}.generated.json`)
  }
}

await build()
