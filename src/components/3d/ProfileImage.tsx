import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { portfolioData } from '../../data/portfolio';

// A custom shader material for the holographic photo effect
const HologramMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uColor: { value: new THREE.Color('#6366f1') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Add subtle wave distortion to the geometry
      vec3 pos = position;
      pos.z += sin(pos.y * 10.0 + uTime * 2.0) * 0.05;
      pos.x += cos(pos.y * 8.0 + uTime * 1.5) * 0.02;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Sample texture
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Create scanlines
      float scanline = sin(vUv.y * 100.0 - uTime * 5.0) * 0.04;
      
      // Create glitch/hologram RGB split effect
      float r = texture2D(uTexture, vec2(vUv.x + 0.01 * sin(uTime * 3.0), vUv.y)).r;
      float g = texColor.g;
      float b = texture2D(uTexture, vec2(vUv.x - 0.01 * cos(uTime * 2.0), vUv.y)).b;
      
      vec3 glitchColor = vec3(r, g, b);
      
      // Mix base color, glitch, and tint
      vec3 finalColor = mix(glitchColor, uColor * texColor.rgb, 0.3);
      
      // Add scanlines and noise
      finalColor += scanline;
      finalColor += vec3(fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.05);
      
      // Edge glow (fresnel-like effect on 2D plane)
      float edgeDist = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
      float edgeGlow = pow(edgeDist, 3.0);
      finalColor += uColor * edgeGlow * 1.5;
      
      // Fade edges based on alpha from texture
      float alpha = texColor.a * (1.0 - pow(edgeDist, 4.0));
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export function ProfileImage() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  
  // Try to load the texture. If it fails, we fall back to a basic material.
  // Using useLoader allows us to catch errors if the image doesn't exist.
  const texture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      return loader.load(portfolioData.photo);
    } catch (e) {
      return null;
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { mouse } = state;

    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      
      // Gentle rotation tracking mouse
      meshRef.current.rotation.y = mouse.x * 0.2;
      meshRef.current.rotation.x = -mouse.y * 0.2;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }
  });

  // If no texture loaded successfully, just don't render or render a fallback
  if (!texture) return null;

  return (
    <group position={[2.5, 0, -1]}>
      <mesh ref={meshRef}>
        {/* A plane that matches aspect ratio of most profile pics */}
        <planeGeometry args={[2, 2.5, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={HologramMaterial.vertexShader}
          fragmentShader={HologramMaterial.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uTexture: { value: texture },
            uColor: { value: new THREE.Color('#6366f1') }
          }}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Background glow behind the image */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2.2, 2.7]} />
        <meshBasicMaterial 
          color="#a855f7" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
