export interface FrontMatterResult<T extends Record<string, unknown>> {
  data: Partial<T>
  content: string
}

const FRONT_MATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/

export function parseFrontMatter<T extends Record<string, unknown>>(
  raw: string,
): FrontMatterResult<T> {
  if (!raw) {
    return { data: {}, content: '' }
  }

  const match = raw.match(FRONT_MATTER_RE)

  if (!match) {
    return { data: {}, content: raw.trim() }
  }

  const data = buildData(match[1])
  const content = raw.slice(match[0].length).trim()

  return { data: data as Partial<T>, content }
}

function buildData(block: string): Record<string, unknown> {
  const lines = block.split(/\r?\n/)
  const data: Record<string, unknown> = {}
  let currentKey: string | null = null

  for (const line of lines) {
    if (!line.trim()) {
      continue
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/)

    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = []
      }

      ;(data[currentKey] as unknown[]).push(parseScalar(listMatch[1]))
      continue
    }

    const colonIndex = line.indexOf(':')

    if (colonIndex === -1) {
      continue
    }

    const key = line.slice(0, colonIndex).trim()
    const rawValue = line.slice(colonIndex + 1).trim()

    if (!rawValue) {
      data[key] = []
      currentKey = key
      continue
    }

    data[key] = parseScalar(rawValue)
    currentKey = null
  }

  return data
}

function parseScalar(value: string): unknown {
  const text = value.trim()

  if (!text) {
    return ''
  }

  const isQuoted =
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))

  if (isQuoted) {
    return text.slice(1, -1)
  }

  if (text === 'true' || text === 'false') {
    return text === 'true'
  }

  if (/^-?\d+(\.\d+)?$/.test(text)) {
    const numericValue = Number(text)
    return Number.isNaN(numericValue) ? text : numericValue
  }

  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim()

    if (!inner) {
      return []
    }

    return inner.split(',').map((part) => parseScalar(part))
  }

  return text
}
