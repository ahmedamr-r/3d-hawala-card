import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useCardStore } from '../../store/useCardStore';

export default function Effects() {
  const metallicEdge = useCardStore((s) => s.metallicEdge);

  if (!metallicEdge) return null;

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        intensity={0.8}
        mipmapBlur
      />
    </EffectComposer>
  );
}
