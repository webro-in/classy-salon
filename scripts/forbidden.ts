/**
 * Content that must never ship (docs/PRD.md §10). Shared by the content check
 * (source data) and verify-dist (rendered HTML).
 */
export const FORBIDDEN_CONTENT: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /geetanjali/i, reason: 'reference-site content (Geetanjali)' },
  { pattern: /style\s*n\s*scissors/i, reason: 'competitor content (Style N Scissors)' },
  { pattern: /bhavikaa/i, reason: 'competitor content (Amber by Bhavikaa)' },
  { pattern: /experts in all aspects of hair/i, reason: 'competitor headline wording' },
  { pattern: /tony\s*&?\s*guy|vidal sassoon/i, reason: 'unverified training claim from competitor copy' },
  { pattern: /\bofficial partner|partner brands?\b/i, reason: 'unverified partnership claim' },
  { pattern: /anjani/i, reason: 'named person without approval' },
  { pattern: /\bbest salon\b|\bno\.?\s?1 salon\b|award[- ]winning/i, reason: 'unverified superlative claim' },
  { pattern: /lorem ipsum/i, reason: 'filler text' },
]

/**
 * Whole-value heuristics for test/fake contact data. Deliberately narrow:
 * a false positive would block a legitimate release.
 */
export function looksFake(value: string): boolean {
  const digits = value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  if (/x{3,}/i.test(value)) return true
  if (/@(example|test)\.|^test@|dummy|placeholder/i.test(value)) return true
  if (digits.length >= 10 && (/^(\d)\1+$/.test(digits) || ['1234567890', '9876543210', '0123456789'].includes(digits) || /0{6,}/.test(digits))) return true
  return false
}
