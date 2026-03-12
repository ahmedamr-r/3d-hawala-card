import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardStore } from '../../store/useCardStore';
import { useShallow } from 'zustand/react/shallow';
import { useTextureLoader } from '../../hooks/useTextureLoader';
import OverlayLayer from './OverlayMesh';

const CARD_WIDTH = 3.37;
const CARD_HEIGHT = 2.125;
const CARD_DEPTH = 0.02;

/** Create a rounded-rect THREE.Shape centered at origin */
function makeRoundedRectShape(w: number, h: number, r: number) {
  const hw = w / 2;
  const hh = h / 2;
  const cr = Math.min(r, hw, hh);

  const shape = new THREE.Shape();
  shape.moveTo(-hw + cr, -hh);
  shape.lineTo(hw - cr, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + cr);
  shape.lineTo(hw, hh - cr);
  shape.quadraticCurveTo(hw, hh, hw - cr, hh);
  shape.lineTo(-hw + cr, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - cr);
  shape.lineTo(-hw, -hh + cr);
  shape.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
  return shape;
}

/** Build a rounded-rect ShapeGeometry (flat plane) with correct 0–1 UVs */
function useRoundedPlane(w: number, h: number, r: number) {
  return useMemo(() => {
    const hw = w / 2;
    const hh = h / 2;
    const shape = makeRoundedRectShape(w, h, r);
    const geo = new THREE.ShapeGeometry(shape, 16);

    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + hw) / w;
      uvs[i * 2 + 1] = (pos.getY(i) + hh) / h;
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geo;
  }, [w, h, r]);
}

/** Build an extruded rounded-rect body (flat depth, rounded XY corners) */
function useCardBodyGeometry(w: number, h: number, depth: number, r: number) {
  return useMemo(() => {
    const shape = makeRoundedRectShape(w, h, r);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      curveSegments: 16,
    });
    // ExtrudeGeometry extrudes along +Z starting at z=0; center it
    geo.translate(0, 0, -depth / 2);
    geo.computeVertexNormals();
    return geo;
  }, [w, h, depth, r]);
}

function ShimmerOverlay({ cornerRadius }: { cornerRadius: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const shimmerSweep = useCardStore((s) => s.shimmerSweep);
  const geo = useRoundedPlane(CARD_WIDTH - 0.02, CARD_HEIGHT - 0.02, cornerRadius);

  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float diagonal = (vUv.x + vUv.y) * 0.5;
        float sweep = fract(uTime * 0.3);
        float dist = abs(diagonal - sweep);
        float highlight = smoothstep(0.15, 0.0, dist) * 0.4;
        gl_FragColor = vec4(1.0, 1.0, 1.0, highlight);
      }
    `,
  }), []);

  useFrame((_, delta) => {
    if (matRef.current && shimmerSweep) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  if (!shimmerSweep) return null;

  return (
    <mesh position={[0, 0, CARD_DEPTH / 2 + 0.002]} geometry={geo}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        {...shaderData}
      />
    </mesh>
  );
}

function CardFace({ url, side, cornerRadius }: { url: string | null; side: 'front' | 'back'; cornerRadius: number }) {
  const texture = useTextureLoader(url);
  const { metalness, roughness, clearcoat, iridescence } = useCardStore(useShallow((s) => ({
    metalness: s.metalness,
    roughness: s.roughness,
    clearcoat: s.clearcoat,
    iridescence: s.iridescence,
  })));
  const zOffset = side === 'front' ? CARD_DEPTH / 2 + 0.001 : -(CARD_DEPTH / 2 + 0.001);
  const rotY = side === 'back' ? Math.PI : 0;

  const inset = 0.01;
  const geo = useRoundedPlane(CARD_WIDTH - inset, CARD_HEIGHT - inset, cornerRadius);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, zOffset]} rotation={[0, rotY, 0]} geometry={geo}>
      <meshPhysicalMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        metalness={metalness}
        roughness={roughness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.1}
        iridescence={iridescence}
        iridescenceIOR={1.3}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

function ChipMesh() {
  const chipTexture = useTextureLoader('/chip-texture.png');
  const chipW = 0.45;
  const chipH = 0.35;
  const z = CARD_DEPTH / 2 + 0.002;

  if (!chipTexture) return null;

  return (
    <mesh position={[-0.85, 0.15, z]}>
      <planeGeometry args={[chipW, chipH]} />
      <meshStandardMaterial
        map={chipTexture}
        metalness={0.85}
        roughness={0.2}
        transparent
        alphaTest={0.1}
      />
    </mesh>
  );
}

export default function CardMesh() {
  const { metalness, roughness, clearcoat, iridescence, cornerRadius } = useCardStore(useShallow((s) => ({
    metalness: s.metalness,
    roughness: s.roughness,
    clearcoat: s.clearcoat,
    iridescence: s.iridescence,
    cornerRadius: s.cornerRadius,
  })));
  const frontImage = useCardStore((s) => s.frontImage);
  const backImage = useCardStore((s) => s.backImage);

  const bodyGeo = useCardBodyGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH, cornerRadius);

  return (
    <group>
      <mesh geometry={bodyGeo}>
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={metalness}
          roughness={roughness}
          clearcoat={clearcoat}
          clearcoatRoughness={0.1}
          iridescence={iridescence}
          iridescenceIOR={1.3}
          envMapIntensity={0.6}
        />
      </mesh>
      <CardFace url={frontImage} side="front" cornerRadius={cornerRadius} />
      <CardFace url={backImage} side="back" cornerRadius={cornerRadius} />
      <ChipMesh />
      <ShimmerOverlay cornerRadius={cornerRadius} />
      <OverlayLayer />
    </group>
  );
}
