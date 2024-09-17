"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function ParticleCube({ count = 3000 }) {
  const points = useRef()
  const rotationRef = useRef(new THREE.Euler(0, 0, 0))
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return positions
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Rotate the entire particle system faster
    rotationRef.current.y = Math.sin(t * 1.5) * 1
    rotationRef.current.x = Math.cos(t * 1.5) * 0.5
    points.current.setRotationFromEuler(rotationRef.current)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = particlesPosition[i3]
      const y = particlesPosition[i3 + 1]
      const z = particlesPosition[i3 + 2]

      const targetX = Math.sign(x) * Math.min(Math.abs(x), 1)
      const targetY = Math.sign(y) * Math.min(Math.abs(y), 1)
      const targetZ = Math.sign(z) * Math.min(Math.abs(z), 1)

      points.current.geometry.attributes.position.array[i3] = THREE.MathUtils.lerp(
        x, 
        targetX, 
        Math.sin(t * 2 + i) * 0.5 + 0.5
      )
      points.current.geometry.attributes.position.array[i3 + 1] = THREE.MathUtils.lerp(
        y, 
        targetY, 
        Math.sin(t * 2 + i + 1) * 0.5 + 0.5
      )
      points.current.geometry.attributes.position.array[i3 + 2] = THREE.MathUtils.lerp(
        z, 
        targetZ, 
        Math.sin(t * 2 + i + 2) * 0.5 + 0.5
      )
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation transparent />
    </points>
  )
}

export default function Component() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ alpha: true }} // Enables transparent background
        camera={{ position: [0, 0, 6], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ParticleCube />
      </Canvas>
    </div>
  )
}
