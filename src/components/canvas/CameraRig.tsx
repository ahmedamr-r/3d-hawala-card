import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCardStore } from '../../store/useCardStore';
import { presets } from '../../lib/presets';

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

export default function CameraRig({ cardRef }: { cardRef: React.RefObject<THREE.Group | null> }) {
  const activePreset = useCardStore((s) => s.activePreset);
  const draggingOverlayId = useCardStore((s) => s.draggingOverlayId);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const isFree = activePreset === 'free';
  const isDragging = draggingOverlayId !== null;

  useFrame(() => {
    if (isFree) return;

    const preset = presets[activePreset];

    // Lerp camera position
    _targetPos.set(...preset.cameraPosition);
    camera.position.lerp(_targetPos, 0.05);

    // Lerp orbit target
    if (controlsRef.current) {
      _targetLook.set(...preset.cameraTarget);
      controlsRef.current.target.lerp(_targetLook, 0.05);
      controlsRef.current.update();
    }

    // Lerp card rotation
    if (cardRef.current) {
      cardRef.current.rotation.x += (preset.cardRotation[0] - cardRef.current.rotation.x) * 0.05;
      cardRef.current.rotation.y += (preset.cardRotation[1] - cardRef.current.rotation.y) * 0.05;
      cardRef.current.rotation.z += (preset.cardRotation[2] - cardRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={isFree && !isDragging}
      enableZoom={!isDragging}
      enableRotate={!isDragging}
      minDistance={2}
      maxDistance={10}
      makeDefault
    />
  );
}
