'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedBall() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#dc2626"
          attach="material"
          distort={0.1}
          speed={2}
          roughness={0.2}
        />
      </Sphere>

      {/* Seam lines */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  )
}

export default function CricketBall3D({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <AnimatedBall />
      </Canvas>
    </div>
  )
}
