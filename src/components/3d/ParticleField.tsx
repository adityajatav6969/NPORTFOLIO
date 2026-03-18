import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
}

export function ParticleField({ count = 8000 }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      scrollVelocity.current = Math.min(Math.abs(deltaY) * 0.0005, 0.05); // Cap max added speed
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = -0.0002 - Math.random() / 2000; // Ultra slow base speed in opposite direction
      const xFactor = -30 + Math.random() * 60;
      const yFactor = -15 + Math.random() * 30;
      const zFactor = -15 + Math.random() * 30;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#818cf8'),
    ];
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, [count]);

  useFrame((state) => {
    const { mouse } = state;
    mouseRef.current.x = mouse.x * 1; // Less mouse sensitivity
    mouseRef.current.y = mouse.y * 1;

    // Decay scroll velocity over time
    scrollVelocity.current = Math.max(0, scrollVelocity.current - 0.001);

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += (speed - scrollVelocity.current); // Use slower reverse speed - scroll velocity (which is positive)
      
      const a = Math.cos(t) + Math.sin(t * 0.1) / 10;
      const b = Math.sin(t) + Math.cos(t * 0.2) / 10;
      const s = Math.cos(t) * 0.5 + 0.5;

      particle.mx += (mouseRef.current.x - particle.mx) * 0.005; // Slower mouse follow
      particle.my += (mouseRef.current.y - particle.my) * 0.005;

      dummy.position.set(
        (particle.mx / 2) * factor + xFactor + Math.cos((t / 10) * factor) * (factor / 10),
        (particle.my / 2) * factor + yFactor + Math.sin((t / 10) * factor) * (factor / 10),
        zFactor + Math.cos((t / 10) * factor) * (factor / 10)
      );
      dummy.scale.setScalar(s * 0.05 + 0.01);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </sphereGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}
