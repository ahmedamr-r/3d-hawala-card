import { create } from 'zustand';
import type { CardStore, PresetName, Theme } from '../types';
import { defaults } from '../lib/defaults';

export const useCardStore = create<CardStore>((set) => ({
  frontImage: null,
  backImage: null,
  setFrontImage: (url) => set({ frontImage: url }),
  setBackImage: (url) => set({ backImage: url }),

  activePreset: 'hero',
  setActivePreset: (preset: PresetName) => set({ activePreset: preset }),

  backgroundColor: defaults.backgroundColor,
  useDefaultBg: true,
  setBackgroundColor: (color) => set({ backgroundColor: color, useDefaultBg: false }),
  setUseDefaultBg: (value) => set({ useDefaultBg: value }),

  metalness: defaults.metalness,
  roughness: defaults.roughness,
  clearcoat: defaults.clearcoat,
  iridescence: defaults.iridescence,
  cornerRadius: defaults.cornerRadius,
  setMaterial: (key, value) => set({ [key]: value }),

  keyLightIntensity: defaults.keyLightIntensity,
  fillLightIntensity: defaults.fillLightIntensity,
  rimLightIntensity: defaults.rimLightIntensity,
  keyDirection: defaults.keyDirection,
  setLighting: (key, value) => set({ [key]: value }),

  dropShadow: defaults.dropShadow,
  floatAnimation: defaults.floatAnimation,
  shimmerSweep: defaults.shimmerSweep,
  lightParallax: defaults.lightParallax,
  metallicEdge: defaults.metallicEdge,
  setEffect: (key, value) => set({ [key]: value }),

  exportScale: defaults.exportScale,
  transparentBg: defaults.transparentBg,
  setExportScale: (scale) => set({ exportScale: scale }),
  setTransparentBg: (value) => set({ transparentBg: value }),

  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as Theme) || 'dark',
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    return { theme: next };
  }),

  overlays: [],
  selectedOverlayId: null,
  draggingOverlayId: null,
  addOverlay: (overlay) => set((state) => ({
    overlays: [...state.overlays, { ...overlay, id: crypto.randomUUID() }],
  })),
  updateOverlay: (id, updates) => set((state) => ({
    overlays: state.overlays.map((o) => o.id === id ? { ...o, ...updates } : o),
  })),
  removeOverlay: (id) => set((state) => ({
    overlays: state.overlays.filter((o) => o.id !== id),
    selectedOverlayId: state.selectedOverlayId === id ? null : state.selectedOverlayId,
  })),
  setSelectedOverlayId: (id) => set({ selectedOverlayId: id }),
  setDraggingOverlayId: (id) => set({ draggingOverlayId: id }),

  glRef: null,
  setGlRef: (gl) => set({ glRef: gl }),
}));
