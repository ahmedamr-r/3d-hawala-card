import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useTextureLoader(url: string | null): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = true;
      setTexture(tex);
    });

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [url]);

  return texture;
}
