import { useCallback } from 'react';
import { useCardStore } from '../store/useCardStore';

export function useExport() {
  const exportScale = useCardStore((s) => s.exportScale);
  const transparentBg = useCardStore((s) => s.transparentBg);

  const exportPNG = useCallback((gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
    const width = gl.domElement.width;
    const height = gl.domElement.height;

    // Create offscreen renderer at desired scale
    const offscreen = new (window as any).OffscreenCanvas(width * exportScale, height * exportScale);
    const ctx = offscreen.getContext('2d');

    // Use the existing renderer's canvas
    const prevAlpha = gl.getClearAlpha();
    if (transparentBg) {
      gl.setClearAlpha(0);
    }

    // Set pixel ratio for export
    const prevPixelRatio = gl.getPixelRatio();
    gl.setPixelRatio(exportScale);
    gl.setSize(width, height);
    gl.render(scene, camera);

    // Extract image
    const dataURL = gl.domElement.toDataURL('image/png');

    // Restore
    gl.setPixelRatio(prevPixelRatio);
    gl.setSize(width, height);
    if (transparentBg) {
      gl.setClearAlpha(prevAlpha);
    }

    // Download
    const link = document.createElement('a');
    link.download = `card-${exportScale}x.png`;
    link.href = dataURL;
    link.click();
  }, [exportScale, transparentBg]);

  return { exportPNG };
}
