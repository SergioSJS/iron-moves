// Parses content/*.md (hand-curated, verbatim source of truth — see AGENTS.md)
// into typed JSON matching src/data/schema.ts. Re-run on every `pnpm dev` / `pnpm build`
// (see package.json) rather than committing the output — see AGENTS.md for why.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const IRONSWORN_BAR_DARK = '#30393D'

const NON_CATEGORY_HEADINGS = new Set([
  'Formatting & color legend (extracted from PDF metadata)',
  'Moves Index',
  'A–Z Moves Index',
  'Moves Quick Reference',
])

const MINOR_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'if',
  'in',
  'nor',
  'of',
  'on',
  'or',
  'per',
  'the',
  'to',
  'with',
])

const OUTCOME_KEY_BY_MARKER = {
  'a hit': 'hit',
  'a strong hit': 'strongHit',
  'a weak hit': 'weakHit',
  'a miss': 'miss',
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toTitleCase(str) {
  const words = str.toLowerCase().split(' ')
  return words
    .map((word, i) => {
      if (i !== 0 && i !== words.length - 1 && MINOR_WORDS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

// Groups the raw lines of a move's body into typed events (paragraph / bullets /
// table / blockquote) so mixed chunks — e.g. a lead-in sentence immediately
// followed by bullets with no blank line between them — split correctly.
function tokenizeBody(lines) {
  const events = []
  let paraBuffer = []
  let bulletBuffer = []
  let tableBuffer = []
  let quoteBuffer = []

  const flushPara = () => {
    if (paraBuffer.length) {
      events.push({ type: 'para', text: paraBuffer.join(' ').trim() })
      paraBuffer = []
    }
  }
  const flushBullets = () => {
    if (bulletBuffer.length) {
      events.push({ type: 'bullets', items: bulletBuffer })
      bulletBuffer = []
    }
  }
  const flushTable = () => {
    if (tableBuffer.length) {
      events.push({ type: 'table', lines: tableBuffer })
      tableBuffer = []
    }
  }
  const flushQuote = () => {
    if (quoteBuffer.length) {
      events.push({ type: 'quote', lines: quoteBuffer })
      quoteBuffer = []
    }
  }
  const flushAll = () => {
    flushPara()
    flushBullets()
    flushTable()
    flushQuote()
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    if (line.trim() === '') {
      flushAll()
      continue
    }
    if (line.startsWith('- ')) {
      flushPara()
      flushTable()
      flushQuote()
      bulletBuffer.push(line.slice(2).trim())
      continue
    }
    if (line.startsWith('|')) {
      flushPara()
      flushBullets()
      flushQuote()
      tableBuffer.push(line.trim())
      continue
    }
    if (line.startsWith('>')) {
      flushPara()
      flushBullets()
      flushTable()
      quoteBuffer.push(line)
      continue
    }
    flushBullets()
    flushTable()
    flushQuote()
    paraBuffer.push(line.trim())
  }
  flushAll()
  return events
}

function extractOutcomeMarkers(text) {
  const markerRe = /\*\*On (a strong hit|a weak hit|a hit|a miss)\*\*,?\s*/gi
  const matches = [...text.matchAll(markerRe)]
  if (matches.length === 0) return []
  const segments = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const key = OUTCOME_KEY_BY_MARKER[match[1].toLowerCase()]
    const start = match.index + match[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    segments.push({ key, text: text.slice(start, end).trim() })
  }
  return segments
}

function parseTable(lines) {
  const rows = lines.map((line) =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim()),
  )
  const [headers, , ...bodyRows] = rows
  return { headers, rows: bodyRows }
}

function parseSidebar(lines) {
  const text = lines
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n')
    .trim()
  const titleMatch = text.match(/^\*\*Sidebar(?:\s*[—-]\s*([^*]+?))?\*\*\s*/i)
  if (!titleMatch) return { body: text }
  const title = titleMatch[1]?.trim()
  const body = text
    .slice(titleMatch[0].length)
    .replace(/^[—-]\s*/, '')
    .trim()
  return title ? { title, body } : { body }
}

function appendOutcome(outcomes, key, text) {
  outcomes[key] = outcomes[key] ? `${outcomes[key]}\n\n${text}` : text
}

// Walks a move's tokenized body events and buckets them into the schema's
// trigger / rollOptions / bullets / outcomes / tables / sidebars fields.
// See AGENTS.md for the heuristics this relies on (roll-option bullets always
// contain "**Roll +**"; outcome bullets attach to the most recently opened
// strong/weak/miss/hit paragraph; anything else pre-outcome is a generic bullet).
function parseMoveBody(events) {
  const triggerParts = []
  const bullets = []
  const outcomes = {}
  const tables = []
  const sidebars = []
  let rollOptions
  let inOutcomes = false
  let lastOutcomeKeys = []

  for (const event of events) {
    if (event.type === 'para') {
      const markers = extractOutcomeMarkers(event.text)
      if (markers.length > 0) {
        inOutcomes = true
        lastOutcomeKeys = []
        for (const { key, text } of markers) {
          appendOutcome(outcomes, key, text)
          lastOutcomeKeys.push(key)
        }
      } else if (!inOutcomes) {
        triggerParts.push(event.text)
      } else {
        for (const key of lastOutcomeKeys) appendOutcome(outcomes, key, event.text)
      }
      continue
    }
    if (event.type === 'bullets') {
      const isRollOptions = event.items.some((item) => /\*\*Roll\s*\+/i.test(item))
      if (isRollOptions && !inOutcomes) {
        rollOptions = event.items
        inOutcomes = true
      } else if (!inOutcomes) {
        bullets.push(...event.items)
      } else if (lastOutcomeKeys.length > 0) {
        const joined = event.items.map((item) => `- ${item}`).join('\n')
        for (const key of lastOutcomeKeys) {
          outcomes[key] = outcomes[key] ? `${outcomes[key]}\n${joined}` : joined
        }
      } else {
        bullets.push(...event.items)
      }
      continue
    }
    if (event.type === 'table') {
      tables.push(parseTable(event.lines))
      continue
    }
    if (event.type === 'quote') {
      sidebars.push(parseSidebar(event.lines))
    }
  }

  return {
    trigger: triggerParts.join('\n\n'),
    rollOptions,
    bullets: bullets.length ? bullets : undefined,
    outcomes,
    tables: tables.length ? tables : undefined,
    sidebars: sidebars.length ? sidebars : undefined,
  }
}

function parseIndexTable(markdown, headingPattern) {
  const lines = markdown.split('\n')
  const headingIndex = lines.findIndex((line) => headingPattern.test(line))
  if (headingIndex === -1) return new Map()
  const tableLines = []
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('|')) {
      tableLines.push(line)
    } else if (tableLines.length > 0) {
      break
    }
  }
  const map = new Map()
  // Skip the header row and the "|---|---|" separator row.
  for (const line of tableLines.slice(2)) {
    const cells = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim())
    const [name, , page] = cells
    if (!name || !page) continue
    const key = name.replace(/\\\*$/, '').trim().toLowerCase()
    const pageNumber = Number.parseInt(page, 10)
    if (Number.isFinite(pageNumber)) map.set(key, pageNumber)
  }
  return map
}

function lookupSourcePage(move, indexMap) {
  if (move.tag === 'Scene Challenge Mode') {
    const taggedKey = `${move.title.toLowerCase()} (sc mode)`
    if (indexMap.has(taggedKey)) return indexMap.get(taggedKey)
  }
  return indexMap.get(move.title.toLowerCase())
}

function parseGameFile(markdown, game, indexHeadingPattern) {
  const lines = markdown.split('\n')
  const indexMap = parseIndexTable(markdown, indexHeadingPattern)

  const categories = []
  const moves = []
  let currentCategory = null
  let moveHeadingLine = null
  let moveBodyLines = []
  // Some categories open with a blockquote sidebar before their first move
  // heading (e.g. Starforged's Adventure/Combat/Suffer Moves intros). The
  // schema has no category-level sidebar slot, so fold it into the first move.
  let pendingCategoryQuoteLines = []

  const finalizeMove = () => {
    if (!moveHeadingLine || !currentCategory) return
    let headingText = moveHeadingLine
    let tag
    const dashSplit = headingText.split(' — ')
    if (dashSplit.length === 2) {
      headingText = dashSplit[0]
      tag = dashSplit[1].trim()
    }
    const id = slugify(moveHeadingLine)
    const title = toTitleCase(headingText)

    let bodyLines = moveBodyLines
    if (!tag && bodyLines[0]?.trim() === '*Progress Move*') {
      tag = 'Progress Move'
      bodyLines = bodyLines.slice(1)
    }

    const parsed = parseMoveBody(tokenizeBody(bodyLines))
    const move = {
      id,
      game,
      categoryId: currentCategory.id,
      title,
      ...(tag ? { tag } : {}),
      trigger: parsed.trigger,
      ...(parsed.rollOptions ? { rollOptions: parsed.rollOptions } : {}),
      ...(parsed.bullets ? { bullets: parsed.bullets } : {}),
      outcomes: parsed.outcomes,
      ...(parsed.tables ? { tables: parsed.tables } : {}),
      ...(parsed.sidebars ? { sidebars: parsed.sidebars } : {}),
      crossRefs: [],
    }
    const sourcePage = lookupSourcePage(move, indexMap)
    if (sourcePage !== undefined) move.sourcePage = sourcePage
    moves.push(move)
    moveHeadingLine = null
    moveBodyLines = []
  }

  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/)
    if (h2) {
      finalizeMove()
      const heading = h2[1].trim()
      pendingCategoryQuoteLines = []
      if (NON_CATEGORY_HEADINGS.has(heading)) {
        currentCategory = null
        continue
      }
      const hexMatch = heading.match(/^(.+?)\s*`#([0-9A-Fa-f]{6})`$/)
      const name = hexMatch ? hexMatch[1].trim() : heading
      const color = hexMatch ? `#${hexMatch[2].toUpperCase()}` : IRONSWORN_BAR_DARK
      currentCategory = { id: slugify(name), game, name, color }
      categories.push(currentCategory)
      continue
    }
    const h3 = line.match(/^### (.+)$/)
    if (h3 && currentCategory) {
      finalizeMove()
      moveHeadingLine = h3[1].trim()
      if (pendingCategoryQuoteLines.length) {
        moveBodyLines.push(...pendingCategoryQuoteLines, '')
        pendingCategoryQuoteLines = []
      }
      continue
    }
    if (line.trim() === '---') {
      finalizeMove()
      continue
    }
    if (moveHeadingLine) {
      moveBodyLines.push(line)
    } else if (currentCategory && line.startsWith('>')) {
      pendingCategoryQuoteLines.push(line)
    }
  }
  finalizeMove()

  // Cross-refs: only convert *Italic* spans that exactly match another move's
  // title in this same game, preferring the first (canonical) move with a given
  // base title — e.g. plain "Secure an Advantage" over its Scene Challenge Mode
  // variant, since file order puts the canonical version first.
  const titleToId = new Map()
  for (const move of moves) {
    const key = move.title.toLowerCase()
    if (!titleToId.has(key)) titleToId.set(key, move.id)
  }

  const italicRe = /(?<!\*)\*([^*\n]+)\*(?!\*)/g
  const convert = (text, refs) =>
    text.replace(italicRe, (match, inner) => {
      const id = titleToId.get(inner.trim().toLowerCase())
      if (!id) return match
      refs.add(id)
      return `{move:${id}}`
    })

  for (const move of moves) {
    const refs = new Set()
    move.trigger = convert(move.trigger, refs)
    if (move.rollOptions)
      move.rollOptions = move.rollOptions.map((item) => convert(item, refs))
    if (move.bullets) move.bullets = move.bullets.map((item) => convert(item, refs))
    for (const key of ['hit', 'strongHit', 'weakHit', 'miss']) {
      if (move.outcomes[key]) move.outcomes[key] = convert(move.outcomes[key], refs)
    }
    if (move.tables) {
      for (const table of move.tables) {
        table.headers = table.headers.map((cell) => convert(cell, refs))
        table.rows = table.rows.map((row) => row.map((cell) => convert(cell, refs)))
      }
    }
    if (move.sidebars) {
      for (const sidebar of move.sidebars) {
        if (sidebar.title) sidebar.title = convert(sidebar.title, refs)
        sidebar.body = convert(sidebar.body, refs)
      }
    }
    refs.delete(move.id)
    move.crossRefs = [...refs]
  }

  return { game, categories, moves }
}

function build() {
  const ironswornMd = readFileSync(
    path.join(rootDir, 'content/ironsworn_moves.md'),
    'utf-8',
  )
  const starforgedMd = readFileSync(
    path.join(rootDir, 'content/starforged_moves.md'),
    'utf-8',
  )

  const ironsworn = parseGameFile(ironswornMd, 'ironsworn', /^## Moves Index$/)
  const starforged = parseGameFile(starforgedMd, 'starforged', /^## A–Z Moves Index$/)

  const outDir = path.join(rootDir, 'src/data/en')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(
    path.join(outDir, 'ironsworn.generated.json'),
    JSON.stringify(ironsworn, null, 2) + '\n',
  )
  writeFileSync(
    path.join(outDir, 'starforged.generated.json'),
    JSON.stringify(starforged, null, 2) + '\n',
  )

  console.log(
    `Built ${ironsworn.categories.length} Ironsworn categories / ${ironsworn.moves.length} moves, ` +
      `${starforged.categories.length} Starforged categories / ${starforged.moves.length} moves.`,
  )
}

build()
