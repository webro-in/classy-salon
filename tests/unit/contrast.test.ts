import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** WCAG 2.2 contrast checks for every text/background token pair in use. */
const css = readFileSync('src/styles/tokens.css', 'utf8')
const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!m) throw new Error(`token ${name} not found`)
  return m[1]!
}
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x! + 0.05) / (y! + 0.05)
}

const pairs: Array<[string, string, string, number]> = [
  ['ink on ivory', token('ink'), token('ivory'), 4.5],
  ['ink-muted on ivory', token('ink-muted'), token('ivory'), 4.5],
  ['ink-muted on cream', token('ink-muted'), token('cream'), 4.5],
  ['muted on taupe', '#5c5249', token('taupe'), 4.5],
  ['ink on taupe', token('ink'), token('taupe'), 4.5],
  ['brass-strong on ivory', token('brass-strong'), token('ivory'), 4.5],
  ['accent (brass-strong) on cream', token('brass-strong'), token('cream'), 4.5],
  ['accent (brass-deep) on taupe', token('brass-deep'), token('taupe'), 4.5],
  ['on-night on night', token('on-night'), token('night'), 4.5],
  ['on-night-muted on night', token('on-night-muted'), token('night'), 4.5],
  ['brass-soft on night', token('brass-soft'), token('night'), 4.5],
  ['form error on ivory/cream', token('error'), token('ivory'), 4.5],
  ['form error on cream', token('error'), token('cream'), 4.5],
  ['form error on taupe', '#8a3428', token('taupe'), 4.5],
  ['form error on night', '#eaa99c', token('night'), 4.5],
  ['focus ring brass-strong vs ivory (non-text)', token('brass-strong'), token('ivory'), 3],
]

describe('colour contrast (WCAG AA)', () => {
  it.each(pairs)('%s', (_label, fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min)
  })
})
