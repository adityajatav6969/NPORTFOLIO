import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { mouse } = state;

    meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    meshRef.current.rotation.x = mouse.y * 0.3;
    meshRef.current.rotation.y = time * 0.2 + mouse.x * 0.3;

    glowRef.current.position.copy(meshRef.current.position);
    glowRef.current.scale.setScalar(1.2 + Math.sin(time * 2) * 0.05);
  });

  return (
    <group position={[2.5, 0, -1]}>
      {/* Glow sphere */}
      <Sphere ref={glowRef} args={[0.8, 32, 32]}>
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main orb */}
      <Sphere ref={meshRef} args={[0.7, 64, 64]}>
        <MeshDistortMaterial
          color="#1a1a3e"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[0.35, 32, 32]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
}
