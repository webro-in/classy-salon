import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Shape, ExtrudeGeometry, type Mesh } from 'three'

/**
 * Subtle 3D: a matte, ivory arched frame (the salon-mirror motif) slowly
 * catching a warm light. Loaded lazily, client-only, behind canRender3D().
 * Phase 11 refines it; it is cut if it costs performance (docs/DRD.md §8).
 */
function ArchFrame() {
  const ref = useRef<Mesh>(null)
  const geometry = useMemo(() => {
    const outer = new Shape()
    outer.moveTo(-1, -1.6)
    outer.lineTo(-1, 0.4)
    outer.absarc(0, 0.4, 1, Math.PI, 0, true)
    outer.lineTo(1, -1.6)
    outer.lineTo(-1, -1.6)
    const inner = new Shape()
    inner.moveTo(-0.82, -1.45)
    inner.lineTo(-0.82, 0.4)
    inner.absarc(0, 0.4, 0.82, Math.PI, 0, true)
    inner.lineTo(0.82, -1.45)
    inner.lineTo(-0.82, -1.45)
    outer.holes.push(inner)
    const g = new ExtrudeGeometry(outer, { depth: 0.12, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 48 })
    g.center()
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.18
    ref.current.rotation.x = Math.sin(t * 0.18) * 0.04
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#f8f6f2" roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

export default function ArchMirrorScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.4} color="#f3dcb6" />
      <directionalLight position={[-3, -1, 2]} intensity={0.35} color="#c9a674" />
      <ArchFrame />
    </Canvas>
  )
}
