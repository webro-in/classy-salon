import { readFileSync } from 'node:fs'

/** Minimal JPEG dimension reader (SOF markers) for tests: no dependency needed. */
export function imageSize(path: string): { width: number; height: number } {
  const b = readFileSync(path)
  let i = 2
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue }
    const marker = b[i + 1]!
    const len = b.readUInt16BE(i + 2)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
    }
    i += 2 + len
  }
  throw new Error(`No JPEG size found in ${path}`)
}
