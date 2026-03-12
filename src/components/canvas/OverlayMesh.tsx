import { useMemo, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useCardStore } from '../../store/useCardStore';
import { useTextureLoader } from '../../hooks/useTextureLoader';
import { iconToDataUrl, patternToDataUrl } from '../../lib/iconToDataUrl';
import type { CardOverlay } from '../../types';

const CARD_WIDTH = 3.37;
const CARD_HEIGHT = 2.125;
const CARD_DEPTH = 0.02;
const BASE_SIZE = 0.25;

/**
 * Pattern overlays cover the entire card face as a tiling background.
 */
function PatternMesh({ overlay, zIndex }: { overlay: CardOverlay; zIndex: number }) {
  const dataUrl = useMemo(
    () =>
      patternToDataUrl(
        overlay.iconSources,
        overlay.color,
        overlay.bgColor,
        overlay.patternLayout,
        overlay.patternSpacing,
        overlay.rotation,
      ),
    [
      overlay.iconSources,
      overlay.color,
      overlay.bgColor,
      overlay.patternLayout,
      overlay.patternSpacing,
      overlay.rotation,
    ],
  );

  const texture = useTextureLoader(dataUrl);

  const zBase = overlay.side === 'front'
    ? CARD_DEPTH / 2 + 0.0015
    : -(CARD_DEPTH / 2 + 0.0015);
  const zOffset = overlay.side === 'front'
    ? zBase + zIndex * 0.0001
    : zBase - zIndex * 0.0001;
  const rotY = overlay.side === 'back' ? Math.PI : 0;

  if (!texture) return null;

  return (
    <mesh position={[0, 0, zOffset]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[CARD_WIDTH - 0.04, CARD_HEIGHT - 0.04]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={overlay.opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Free overlays are small, individually positioned and draggable.
 */
function FreeOverlayMesh({ overlay, zIndex }: { overlay: CardOverlay; zIndex: number }) {
  const setDraggingOverlayId = useCardStore((s) => s.setDraggingOverlayId);
  const setSelectedOverlayId = useCardStore((s) => s.setSelectedOverlayId);

  const dataUrl = useMemo(() => {
    if (overlay.type === 'icon') {
      return iconToDataUrl(overlay.source, overlay.color, 128);
    }
    return overlay.source;
  }, [overlay.type, overlay.source, overlay.color]);

  const texture = useTextureLoader(dataUrl);

  const size = BASE_SIZE * overlay.scale;
  const posX = overlay.x * (CARD_WIDTH / 2);
  const posY = overlay.y * (CARD_HEIGHT / 2);
  const zBase = overlay.side === 'front'
    ? CARD_DEPTH / 2 + 0.003
    : -(CARD_DEPTH / 2 + 0.003);
  const zOffset = overlay.side === 'front'
    ? zBase + zIndex * 0.0001
    : zBase - zIndex * 0.0001;
  const rotY = overlay.side === 'back' ? Math.PI : 0;

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDraggingOverlayId(overlay.id);
    setSelectedOverlayId(overlay.id);
  }, [overlay.id, setDraggingOverlayId, setSelectedOverlayId]);

  if (!texture) return null;

  return (
    <mesh
      position={[posX, posY, zOffset]}
      rotation={[0, rotY, (overlay.rotation * Math.PI) / 180]}
      onPointerDown={handlePointerDown}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={overlay.opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Invisible plane that captures pointer events during drag of free overlays.
 */
function DragCapturePlane({ side }: { side: 'front' | 'back' }) {
  const draggingOverlayId = useCardStore((s) => s.draggingOverlayId);
  const updateOverlay = useCardStore((s) => s.updateOverlay);
  const setDraggingOverlayId = useCardStore((s) => s.setDraggingOverlayId);

  const z = side === 'front'
    ? CARD_DEPTH / 2 + 0.006
    : -(CARD_DEPTH / 2 + 0.006);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!draggingOverlayId) return;
    e.stopPropagation();
    const local = e.object.worldToLocal(e.point.clone());
    const nx = Math.max(-1, Math.min(1, local.x / (CARD_WIDTH / 2)));
    const ny = Math.max(-1, Math.min(1, local.y / (CARD_HEIGHT / 2)));
    updateOverlay(draggingOverlayId, { x: nx, y: ny });
  }, [draggingOverlayId, updateOverlay]);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDraggingOverlayId(null);
  }, [setDraggingOverlayId]);

  if (!draggingOverlayId) return null;

  return (
    <mesh
      position={[0, 0, z]}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function OverlayLayer() {
  const overlays = useCardStore((s) => s.overlays);
  const draggingOverlayId = useCardStore((s) => s.draggingOverlayId);

  const draggingOverlay = draggingOverlayId
    ? overlays.find((o) => o.id === draggingOverlayId)
    : null;

  return (
    <>
      {overlays.map((overlay, i) =>
        overlay.mode === 'pattern' ? (
          <PatternMesh key={overlay.id} overlay={overlay} zIndex={i} />
        ) : (
          <FreeOverlayMesh key={overlay.id} overlay={overlay} zIndex={i} />
        ),
      )}
      {draggingOverlay && <DragCapturePlane side={draggingOverlay.side} />}
    </>
  );
}
