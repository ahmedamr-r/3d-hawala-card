export type PatternLayout = 'grid' | 'diagonal' | 'honeycomb' | 'scattered';

export interface CardOverlay {
  id: string;
  type: 'icon' | 'custom';
  mode: 'pattern' | 'free';
  source: string;             // icon name or data URL (free mode)
  iconSources: string[];      // 1-3 icon names (pattern mode)
  patternLayout: PatternLayout;
  patternSpacing: number;     // 0.5-3.0, controls density
  x: number;                  // free: position; pattern: not used
  y: number;
  scale: number;
  rotation: number;           // per-icon rotation in degrees
  color: string;
  bgColor: string;            // pattern background color
  opacity: number;
  side: 'front' | 'back';
}

export type PresetName = 'hero' | 'float' | 'portrait' | 'drama' | 'overhead' | 'stack' | 'free';

export interface PresetConfig {
  label: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cardRotation: [number, number, number];
}

export type Theme = 'light' | 'dark';

export interface CardStore {
  // Card images
  frontImage: string | null;
  backImage: string | null;
  setFrontImage: (url: string | null) => void;
  setBackImage: (url: string | null) => void;

  // Preset
  activePreset: PresetName;
  setActivePreset: (preset: PresetName) => void;

  // Background
  backgroundColor: string;
  useDefaultBg: boolean;
  setBackgroundColor: (color: string) => void;
  setUseDefaultBg: (value: boolean) => void;

  // Material
  metalness: number;
  roughness: number;
  clearcoat: number;
  iridescence: number;
  cornerRadius: number;
  setMaterial: (key: 'metalness' | 'roughness' | 'clearcoat' | 'iridescence' | 'cornerRadius', value: number) => void;

  // Lighting
  keyLightIntensity: number;
  fillLightIntensity: number;
  rimLightIntensity: number;
  keyDirection: number;
  setLighting: (key: 'keyLightIntensity' | 'fillLightIntensity' | 'rimLightIntensity' | 'keyDirection', value: number) => void;

  // Effects
  dropShadow: boolean;
  floatAnimation: boolean;
  shimmerSweep: boolean;
  lightParallax: boolean;
  metallicEdge: boolean;
  setEffect: (key: 'dropShadow' | 'floatAnimation' | 'shimmerSweep' | 'lightParallax' | 'metallicEdge', value: boolean) => void;

  // Export
  exportScale: 1 | 2 | 3 | 4;
  transparentBg: boolean;
  setExportScale: (scale: 1 | 2 | 3 | 4) => void;
  setTransparentBg: (value: boolean) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Overlays
  overlays: CardOverlay[];
  selectedOverlayId: string | null;
  draggingOverlayId: string | null;
  addOverlay: (overlay: Omit<CardOverlay, 'id'>) => void;
  updateOverlay: (id: string, updates: Partial<CardOverlay>) => void;
  removeOverlay: (id: string) => void;
  setSelectedOverlayId: (id: string | null) => void;
  setDraggingOverlayId: (id: string | null) => void;

  // GL ref
  glRef: WebGLRenderingContext | null;
  setGlRef: (gl: WebGLRenderingContext | null) => void;
}
