import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import CardMesh from './CardMesh';
import Lights from './Lights';
import CameraRig from './CameraRig';
import DropShadow from './DropShadow';
import Effects from './Effects';
import { useCardStore } from '../../store/useCardStore';

function GlCapture() {
  const { gl } = useThree();

  useEffect(() => {
    useCardStore.getState().setGlRef(gl as any);
  }, [gl]);

  return null;
}

function CardWrapper({ cardRef }: { cardRef: React.RefObject<THREE.Group | null> }) {
  const floatAnimation = useCardStore((s) => s.floatAnimation);

  const card = (
    <group ref={cardRef}>
      <CardMesh />
    </group>
  );

  if (floatAnimation) {
    return (
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        {card}
      </Float>
    );
  }

  return card;
}

const DEFAULT_BG = { dark: '#0A0A09', light: '#FFFFFF' } as const;

export default function Scene() {
  const backgroundColor = useCardStore((s) => s.backgroundColor);
  const useDefaultBg = useCardStore((s) => s.useDefaultBg);
  const theme = useCardStore((s) => s.theme);
  const cardRef = useRef<THREE.Group>(null);

  const resolvedBg = useDefaultBg ? DEFAULT_BG[theme] : backgroundColor;

  return (
    <Canvas
      gl={{
        preserveDrawingBuffer: true,
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{ position: [0, 1.5, 5], fov: 40 }}
      style={{ background: resolvedBg }}
    >
      <color attach="background" args={[resolvedBg]} />
      <GlCapture />
      <CameraRig cardRef={cardRef} />
      <Lights />
      <Environment preset="studio" environmentIntensity={0.5} />
      <CardWrapper cardRef={cardRef} />
      <DropShadow />
      <Effects />
    </Canvas>
  );
}
