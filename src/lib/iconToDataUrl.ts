import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from 'lucide-react';
import type { PatternLayout } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = icons as Record<string, any>;

export function iconToDataUrl(
  iconName: string,
  color = '#FFFFFF',
  size = 64,
): string | null {
  const Icon = iconMap[iconName];
  if (!Icon || typeof Icon !== 'function') return null;

  const svg = renderToStaticMarkup(
    createElement(Icon, { color, size, strokeWidth: 2 }),
  );
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generate a tiling pattern SVG from 1-3 icons.
 * Uses SVG <pattern> for efficient tiling — icons are defined once and referenced.
 */
export function patternToDataUrl(
  iconNames: string[],
  iconColor: string,
  _bgColor: string,
  layout: PatternLayout,
  spacing: number,
  iconRotation: number,
): string | null {
  if (iconNames.length === 0) return null;

  const iconSize = 28;
  const cellSize = Math.round(iconSize * spacing * 2);
  const count = iconNames.length;
  const half = iconSize / 2;

  // Render each icon once as a <g> def, stripping outer <svg> wrapper
  const defs = iconNames.map((name, i) => {
    const Icon = iconMap[name];
    if (!Icon || typeof Icon !== 'function') return '';
    const markup = renderToStaticMarkup(
      createElement(Icon, { color: iconColor, size: iconSize, strokeWidth: 2 }),
    );
    const inner = markup.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const rotTransform = iconRotation ? ` transform="rotate(${iconRotation} ${half} ${half})"` : '';
    return `<g id="ic${i}" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${rotTransform}>${inner}</g>`;
  }).join('\n');

  let patternContent: string;
  let patternW: number;
  let patternH: number;
  let patternTransform = '';

  switch (layout) {
    case 'grid': {
      patternW = cellSize * count;
      patternH = cellSize;
      patternContent = iconNames.map((_, i) => {
        const cx = i * cellSize + cellSize / 2 - half;
        const cy = cellSize / 2 - half;
        return `<use xlink:href="#ic${i}" x="${cx}" y="${cy}" />`;
      }).join('\n');
      break;
    }
    case 'diagonal': {
      patternW = cellSize * count;
      patternH = cellSize;
      patternContent = iconNames.map((_, i) => {
        const cx = i * cellSize + cellSize / 2 - half;
        const cy = cellSize / 2 - half;
        return `<use xlink:href="#ic${i}" x="${cx}" y="${cy}" />`;
      }).join('\n');
      patternTransform = ` patternTransform="rotate(45)"`;
      break;
    }
    case 'honeycomb': {
      const rowH = Math.round(cellSize * 0.866);
      patternW = cellSize * count;
      patternH = rowH * 2;
      let uses = iconNames.map((_, i) => {
        const cx = i * cellSize + cellSize / 2 - half;
        const cy = rowH / 2 - half;
        return `<use xlink:href="#ic${i}" x="${cx}" y="${cy}" />`;
      }).join('\n');
      uses += '\n' + iconNames.map((_, i) => {
        const cx = i * cellSize + cellSize - half;
        const cy = rowH + rowH / 2 - half;
        return `<use xlink:href="#ic${(i + 1) % count}" x="${cx}" y="${cy}" />`;
      }).join('\n');
      patternContent = uses;
      break;
    }
    case 'scattered': {
      const tileN = 4;
      patternW = cellSize * tileN;
      patternH = cellSize * tileN;
      let uses = '';
      let idx = 0;
      for (let r = 0; r < tileN; r++) {
        for (let c = 0; c < tileN; c++) {
          const seed = r * tileN + c + 7;
          const rx = ((seed * 9301 + 49297) % 233280) / 233280 - 0.5;
          const ry = ((seed * 49297 + 9301) % 233280) / 233280 - 0.5;
          const cx = c * cellSize + cellSize / 2 + rx * cellSize * 0.5 - half;
          const cy = r * cellSize + cellSize / 2 + ry * cellSize * 0.5 - half;
          uses += `<use xlink:href="#ic${idx % count}" x="${cx}" y="${cy}" />\n`;
          idx++;
        }
      }
      patternContent = uses;
      break;
    }
  }

  const svgW = 1024;
  const svgH = 645;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgW}" height="${svgH}">
<defs>
${defs}
<pattern id="p" width="${patternW}" height="${patternH}" patternUnits="userSpaceOnUse"${patternTransform}>
${patternContent}
</pattern>
</defs>
<rect width="${svgW}" height="${svgH}" fill="url(#p)" />
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getIconNames(): string[] {
  return Object.keys(icons).filter(
    (key) => key !== 'default' && key !== 'createLucideIcon' && key !== 'icons' && typeof iconMap[key] === 'function',
  );
}

export const CURATED_ICONS = [
  'Heart', 'Star', 'Shield', 'Crown', 'Diamond', 'Gem',
  'Flame', 'Zap', 'Sun', 'Moon', 'Globe', 'Lock',
  'Eye', 'Music', 'Camera', 'Wifi', 'Bluetooth', 'CreditCard',
  'Fingerprint', 'QrCode', 'Sparkles', 'Award', 'Rocket', 'Plane',
];
