import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { ParticleField } from './ParticleField';
import { ProfileImage } from './ProfileImage';
import { AmbientParticles } from './AmbientParticles';

export function Scene() {
  return (
    <div className="hero-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050510']} />
          <fog attach="fog" args={['#050510', 5, 25]} />

          <ambientLight intensity={0.15} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
          <pointLight position={[0, 5, -5]} intensity={0.2} color="#22d3ee" />

          <ParticleField count={8000} />
          <AmbientParticles count={500} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={1.5}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0005]}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
