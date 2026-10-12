import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { canRender3D } from './canRender3D'
import { SceneBoundary } from './SceneBoundary'

// Scene modules are named *.scene.tsx: their chunks are never modulepreloaded
// (see stripScenePreloads in src/app/prerender.ts), so they only download when used.
const ArchMirrorScene = lazy(() => import('./ArchMirror.scene'))

/**
 * Renders `fallback` (static media) on the server, without JS, and on any
 * device that fails canRender3D(). The 3D chunk is only downloaded when used.
 */
export function Optional3D({ fallback, className }: { fallback: ReactNode; className?: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(canRender3D())
  }, [])

  return (
    <div className={className} data-3d={enabled ? 'on' : 'off'}>
      {enabled ? (
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <ArchMirrorScene />
          </Suspense>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
