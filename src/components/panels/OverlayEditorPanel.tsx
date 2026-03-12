import PanelSection from '../shared/PanelSection';
import ColorPicker from '../shared/ColorPicker';
import { useCardStore } from '../../store/useCardStore';
import { useShallow } from 'zustand/react/shallow';
import { iconToDataUrl, patternToDataUrl } from '../../lib/iconToDataUrl';
import type { PatternLayout } from '../../types';

const PATTERN_LAYOUTS: { value: PatternLayout; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'honeycomb', label: 'Honeycomb' },
  { value: 'scattered', label: 'Scattered' },
];

export default function OverlayEditorPanel() {
  const { overlays, selectedOverlayId, setSelectedOverlayId, updateOverlay, removeOverlay } =
    useCardStore(useShallow((s) => ({
      overlays: s.overlays,
      selectedOverlayId: s.selectedOverlayId,
      setSelectedOverlayId: s.setSelectedOverlayId,
      updateOverlay: s.updateOverlay,
      removeOverlay: s.removeOverlay,
    })));

  if (overlays.length === 0) return null;

  const selected = overlays.find((o) => o.id === selectedOverlayId);

  return (
    <PanelSection title="Overlay Editor">
      <div className="overlay-list">
        {overlays.map((o) => {
          let preview: string | null;
          if (o.mode === 'pattern') {
            preview = patternToDataUrl(o.iconSources, o.color, o.bgColor, o.patternLayout, o.patternSpacing, o.rotation);
          } else if (o.type === 'icon') {
            preview = iconToDataUrl(o.source, o.color, 24);
          } else {
            preview = o.source;
          }

          const label = o.mode === 'pattern'
            ? `${o.patternLayout} (${o.iconSources.join(', ')})`
            : o.type === 'icon' ? o.source : 'Custom Image';

          return (
            <div
              key={o.id}
              className={`overlay-list-item ${o.id === selectedOverlayId ? 'active' : ''}`}
              onClick={() => setSelectedOverlayId(o.id === selectedOverlayId ? null : o.id)}
            >
              {preview && (
                <img src={preview} alt="" width={20} height={20} className="overlay-list-preview" />
              )}
              <span className="overlay-list-name">{label}</span>
              <span className="overlay-mode-badge">{o.mode}</span>
              <button
                className="btn-small btn-danger overlay-delete"
                onClick={(e) => { e.stopPropagation(); removeOverlay(o.id); }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="overlay-controls">
          {/* ── Pattern-specific controls ── */}
          {selected.mode === 'pattern' && (
            <>
              <label className="dropzone-label">Layout</label>
              <div className="presets-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 8 }}>
                {PATTERN_LAYOUTS.map((p) => (
                  <button
                    key={p.value}
                    className={`preset-btn small ${selected.patternLayout === p.value ? 'active' : ''}`}
                    onClick={() => updateOverlay(selected.id, { patternLayout: p.value })}
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
                  value={selected.patternSpacing}
                  onChange={(e) => updateOverlay(selected.id, { patternSpacing: +e.target.value })}
                />
                <span className="slider-value">{selected.patternSpacing.toFixed(1)}</span>
              </div>

              <div className="slider-row">
                <label>Icon Angle</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={5}
                  value={selected.rotation}
                  onChange={(e) => updateOverlay(selected.id, { rotation: +e.target.value })}
                />
                <span className="slider-value">{selected.rotation}°</span>
              </div>

              <div className="slider-row">
                <label>Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={selected.opacity}
                  onChange={(e) => updateOverlay(selected.id, { opacity: +e.target.value })}
                />
                <span className="slider-value">{selected.opacity.toFixed(2)}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label className="dropzone-label">Icon Color</label>
                <ColorPicker
                  value={selected.color}
                  onChange={(color) => updateOverlay(selected.id, { color })}
                />
              </div>

            </>
          )}

          {/* ── Free icon controls ── */}
          {selected.mode === 'free' && (
            <>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Drag this icon on the card, or use sliders.
              </p>

              <div className="slider-row">
                <label>X Position</label>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={selected.x}
                  onChange={(e) => updateOverlay(selected.id, { x: +e.target.value })}
                />
                <span className="slider-value">{selected.x.toFixed(2)}</span>
              </div>
              <div className="slider-row">
                <label>Y Position</label>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={selected.y}
                  onChange={(e) => updateOverlay(selected.id, { y: +e.target.value })}
                />
                <span className="slider-value">{selected.y.toFixed(2)}</span>
              </div>
              <div className="slider-row">
                <label>Scale</label>
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.05}
                  value={selected.scale}
                  onChange={(e) => updateOverlay(selected.id, { scale: +e.target.value })}
                />
                <span className="slider-value">{selected.scale.toFixed(2)}</span>
              </div>
              <div className="slider-row">
                <label>Rotation</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={selected.rotation}
                  onChange={(e) => updateOverlay(selected.id, { rotation: +e.target.value })}
                />
                <span className="slider-value">{selected.rotation}°</span>
              </div>
              <div className="slider-row">
                <label>Opacity</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={selected.opacity}
                  onChange={(e) => updateOverlay(selected.id, { opacity: +e.target.value })}
                />
                <span className="slider-value">{selected.opacity.toFixed(2)}</span>
              </div>

              {selected.type === 'icon' && (
                <div style={{ marginBottom: 8 }}>
                  <label className="dropzone-label">Icon Color</label>
                  <ColorPicker
                    value={selected.color}
                    onChange={(color) => updateOverlay(selected.id, { color })}
                  />
                </div>
              )}
            </>
          )}

          {/* ── Side toggle (shared) ── */}
          <div style={{ marginBottom: 8 }}>
            <label className="dropzone-label">Side</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`preset-btn small ${selected.side === 'front' ? 'active' : ''}`}
                onClick={() => updateOverlay(selected.id, { side: 'front' })}
              >
                Front
              </button>
              <button
                className={`preset-btn small ${selected.side === 'back' ? 'active' : ''}`}
                onClick={() => updateOverlay(selected.id, { side: 'back' })}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelSection>
  );
}
