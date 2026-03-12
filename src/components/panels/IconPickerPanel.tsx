import { useState, useMemo, useCallback } from 'react';
import PanelSection from '../shared/PanelSection';
import ColorPicker from '../shared/ColorPicker';
import { useCardStore } from '../../store/useCardStore';
import { getIconNames, CURATED_ICONS, iconToDataUrl, patternToDataUrl } from '../../lib/iconToDataUrl';
import type { PatternLayout } from '../../types';

const allIcons = getIconNames();

const PATTERN_LAYOUTS: { value: PatternLayout; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'honeycomb', label: 'Honeycomb' },
  { value: 'scattered', label: 'Scattered' },
];

function IconGrid({
  search,
  onSearch,
  onIconClick,
}: {
  search: string;
  onSearch: (v: string) => void;
  onIconClick: (name: string) => void;
}) {
  const displayedIcons = useMemo(() => {
    if (!search.trim()) return CURATED_ICONS;
    const q = search.toLowerCase();
    return allIcons.filter((name) => name.toLowerCase().includes(q)).slice(0, 50);
  }, [search]);

  return (
    <>
      <input
        type="text"
        className="icon-search"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="icon-grid">
        {displayedIcons.map((name) => {
          const url = iconToDataUrl(name, 'currentColor', 24);
          return (
            <button
              key={name}
              className="icon-cell"
              title={name}
              onClick={() => onIconClick(name)}
            >
              {url ? <img src={url} alt={name} width={20} height={20} /> : name[0]}
            </button>
          );
        })}
      </div>
      {displayedIcons.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '8px 0' }}>
          No icons found
        </div>
      )}
    </>
  );
}

function PatternBuilder() {
  const [search, setSearch] = useState('');
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [iconColor, setIconColor] = useState('#FFFFFF');

  const [layout, setLayout] = useState<PatternLayout>('grid');
  const [spacing, setSpacing] = useState(1.0);
  const [iconRotation, setIconRotation] = useState(0);
  const addOverlay = useCardStore((s) => s.addOverlay);

  const handleIconClick = useCallback((name: string) => {
    setSelectedIcons((prev) => {
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  }, []);

  const removeSlot = useCallback((index: number) => {
    setSelectedIcons((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleApply = useCallback(() => {
    if (selectedIcons.length === 0) return;
    addOverlay({
      type: 'icon',
      mode: 'pattern',
      source: selectedIcons[0],
      iconSources: [...selectedIcons],
      patternLayout: layout,
      patternSpacing: spacing,
      x: 0,
      y: 0,
      scale: 1,
      rotation: iconRotation,
      color: iconColor,
      bgColor: 'transparent',
      opacity: 1,
      side: 'front',
    });
    setSelectedIcons([]);
  }, [selectedIcons, iconColor, layout, spacing, iconRotation, addOverlay]);

  const previewUrl = useMemo(() => {
    if (selectedIcons.length === 0) return null;
    return patternToDataUrl(selectedIcons, iconColor, 'transparent', layout, spacing, iconRotation);
  }, [selectedIcons, iconColor, layout, spacing, iconRotation]);

  return (
    <div>
      <label className="dropzone-label">Pick 1-3 icons for the pattern</label>
      <div className="pattern-slots">
        {[0, 1, 2].map((i) => {
          const name = selectedIcons[i];
          const url = name ? iconToDataUrl(name, iconColor, 32) : null;
          return (
            <div key={i} className={`pattern-slot ${name ? 'filled' : ''}`}>
              {url ? (
                <>
                  <img src={url} alt={name} width={24} height={24} />
                  <button className="pattern-slot-remove" onClick={() => removeSlot(i)}>x</button>
                </>
              ) : (
                <span className="pattern-slot-empty">{i + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {previewUrl && (
        <div className="pattern-preview">
          <label className="dropzone-label">Preview</label>
          <img src={previewUrl} alt="Pattern preview" className="pattern-preview-img" />
        </div>
      )}

      <label className="dropzone-label" style={{ marginTop: 8 }}>Layout</label>
      <div className="presets-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 8 }}>
        {PATTERN_LAYOUTS.map((p) => (
          <button
            key={p.value}
            className={`preset-btn small ${layout === p.value ? 'active' : ''}`}
            onClick={() => setLayout(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="slider-row">
        <label>Spacing</label>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          value={spacing}
          onChange={(e) => setSpacing(+e.target.value)}
        />
        <span className="slider-value">{spacing.toFixed(1)}</span>
      </div>

      <div className="slider-row">
        <label>Icon Angle</label>
        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={iconRotation}
          onChange={(e) => setIconRotation(+e.target.value)}
        />
        <span className="slider-value">{iconRotation}°</span>
      </div>

      <div style={{ marginBottom: 8, marginTop: 4 }}>
        <label className="dropzone-label">Icon Color</label>
        <ColorPicker value={iconColor} onChange={setIconColor} />
      </div>
      <button
        className="btn-export"
        style={{ marginTop: 4, opacity: selectedIcons.length === 0 ? 0.5 : 1 }}
        disabled={selectedIcons.length === 0}
        onClick={handleApply}
      >
        Apply Pattern to Card
      </button>

      <div style={{ marginTop: 12 }}>
        <IconGrid search={search} onSearch={setSearch} onIconClick={handleIconClick} />
      </div>
    </div>
  );
}

function FreeIcons() {
  const [search, setSearch] = useState('');
  const addOverlay = useCardStore((s) => s.addOverlay);

  const handleIconClick = useCallback((iconName: string) => {
    addOverlay({
      type: 'icon',
      mode: 'free',
      source: iconName,
      iconSources: [],
      patternLayout: 'grid',
      patternSpacing: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      color: '#FFFFFF',
      bgColor: '#000000',
      opacity: 1,
      side: 'front',
    });
  }, [addOverlay]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) return;
    const reader = new FileReader();
    reader.onload = () => {
      addOverlay({
        type: 'custom',
        mode: 'free',
        source: reader.result as string,
        iconSources: [],
        patternLayout: 'grid',
        patternSpacing: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        color: '#FFFFFF',
        bgColor: '#000000',
        opacity: 1,
        side: 'front',
      });
    };
    reader.readAsDataURL(file);
  }, [addOverlay]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDropzoneClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.svg';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
        Click an icon to add it, then drag it on the card to position.
      </p>
      <IconGrid search={search} onSearch={setSearch} onIconClick={handleIconClick} />
      <div className="dropzone-wrapper" style={{ marginTop: 12 }}>
        <label className="dropzone-label">Custom Image/SVG</label>
        <div
          className="dropzone"
          onClick={handleDropzoneClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <span className="dropzone-placeholder">Drop image or click</span>
        </div>
      </div>
    </div>
  );
}

export default function IconPickerPanel() {
  const [tab, setTab] = useState<'pattern' | 'free'>('pattern');

  return (
    <PanelSection title="Icon Overlays" defaultOpen={false}>
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'pattern' ? 'active' : ''}`}
          onClick={() => setTab('pattern')}
        >
          Pattern
        </button>
        <button
          className={`tab-btn ${tab === 'free' ? 'active' : ''}`}
          onClick={() => setTab('free')}
        >
          Free Icons
        </button>
      </div>
      {tab === 'pattern' ? <PatternBuilder /> : <FreeIcons />}
    </PanelSection>
  );
}
