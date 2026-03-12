import { ContactShadows } from '@react-three/drei';
import { useCardStore } from '../../store/useCardStore';

export default function DropShadow() {
  const dropShadow = useCardStore((s) => s.dropShadow);

  if (!dropShadow) return null;

  return (
    <ContactShadows
      position={[0, -1.2, 0]}
      opacity={0.6}
      scale={8}
      blur={2.5}
      far={4}
    />
  );
}
