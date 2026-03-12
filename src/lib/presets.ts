import type { PresetName, PresetConfig } from '../types';

export const presets: Record<PresetName, PresetConfig> = {
  hero: {
    label: 'Hero',
    cameraPosition: [0, 1.5, 5],
    cameraTarget: [0, 0, 0],
    cardRotation: [0, 0, 0],
  },
  float: {
    label: 'Float',
    cameraPosition: [0, 2.5, 4.5],
    cameraTarget: [0, 0, 0],
    cardRotation: [-0.15, 0.2, 0.05],
  },
  portrait: {
    label: 'Portrait',
    cameraPosition: [0, 0.5, 4],
    cameraTarget: [0, 0, 0],
    cardRotation: [0, Math.PI / 2 - 0.3, 0],
  },
  drama: {
    label: 'Drama',
    cameraPosition: [-3, 2, 4],
    cameraTarget: [0, 0, 0],
    cardRotation: [0.1, -0.4, 0.1],
  },
  overhead: {
    label: 'Overhead',
    cameraPosition: [0, 5.5, 0.5],
    cameraTarget: [0, 0, 0],
    cardRotation: [0, 0, 0],
  },
  stack: {
    label: 'Stack',
    cameraPosition: [1.5, 3, 4],
    cameraTarget: [0, 0, 0],
    cardRotation: [0, -0.15, 0.1],
  },
  free: {
    label: 'Free Movement',
    cameraPosition: [0, 1.5, 5],
    cameraTarget: [0, 0, 0],
    cardRotation: [0, 0, 0],
  },
};
