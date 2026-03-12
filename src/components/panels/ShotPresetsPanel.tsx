import { useCardStore } from '../../store/useCardStore';
import { presets } from '../../lib/presets';
import type { PresetName } from '../../types';
import PanelSection from '../shared/PanelSection';

const PRESET_KEYS = Object.keys(presets) as PresetName[];

export default function ShotPresetsPanel() {
  const activePreset = useCardStore((s) => s.activePreset);
  const setActivePreset = useCardStore((s) => s.setActivePreset);

  return (
    <PanelSection title="Shot Presets">
      <div className="presets-grid">
        {PRESET_KEYS.map((key) => (
          <button
            key={key}
            className={`preset-btn ${activePreset === key ? 'active' : ''}`}
            onClick={() => setActivePreset(key)}
          >
            {presets[key].label}
          </button>
        ))}
      </div>
    </PanelSection>
  );
}
