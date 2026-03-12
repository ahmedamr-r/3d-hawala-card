import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardStore } from '../../store/useCardStore';

export default function Lights() {
  const keyRef = useRef<THREE.DirectionalLight>(null);

  const keyLightIntensity = useCardStore((s) => s.keyLightIntensity);
  const fillLightIntensity = useCardStore((s) => s.fillLightIntensity);
  const rimLightIntensity = useCardStore((s) => s.rimLightIntensity);
  const keyDirection = useCardStore((s) => s.keyDirection);
  const lightParallax = useCardStore((s) => s.lightParallax);

  const { pointer } = useThree();

  const rad = (keyDirection * Math.PI) / 180;
  const baseX = Math.cos(rad) * 5;
  const baseZ = Math.sin(rad) * 5;

  useFrame(() => {
    if (keyRef.current && lightParallax) {
      keyRef.current.position.x = baseX + pointer.x * 2;
      keyRef.current.position.z = baseZ + pointer.y * 2;
    }
  });

  return (
    <>
      <directionalLight
        ref={keyRef}
        position={[baseX, 5, baseZ]}
        intensity={keyLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 3, -2]}
        intensity={fillLightIntensity}
        color="#b0c4ff"
      />
      <directionalLight
        position={[0, 4, -5]}
        intensity={rimLightIntensity}
        color="#ffe0d0"
      />
      <ambientLight intensity={0.3} />
    </>
  );
}
