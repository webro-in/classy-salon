/**
 * Capability gate for optional 3D (docs/DRD.md §8).
 * 3D only renders on large, capable screens with WebGL2, no reduced-motion
 * preference and no data saver. Everything else gets the static media fallback.
 */
export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (!window.matchMedia('(min-width: 1024px)').matches) return false
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return false
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
