import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';

const SLIDERS: { key: 'metalness' | 'roughness' | 'clearcoat' | 'iridescence' | 'cornerRadius'; label: string; min?: number; max?: number; step?: number }[] = [
  { key: 'metalness', label: 'Metalness' },
  { key: 'roughness', label: 'Roughness' },
  { key: 'clearcoat', label: 'Clearcoat' },
  { key: 'iridescence', label: 'Iridescence' },
  { key: 'cornerRadius', label: 'Corner Radius', min: 0, max: 0.5, step: 0.01 },
];

export default function MaterialPanel() {
  const metalness = useCardStore((s) => s.metalness);
  const roughness = useCardStore((s) => s.roughness);
  const clearcoat = useCardStore((s) => s.clearcoat);
  const iridescence = useCardStore((s) => s.iridescence);
  const cornerRadius = useCardStore((s) => s.cornerRadius);
  const setMaterial = useCardStore((s) => s.setMaterial);

  const values = { metalness, roughness, clearcoat, iridescence, cornerRadius };

  return (
    <PanelSection title="Material">
      {SLIDERS.map(({ key, label, min = 0, max = 1, step = 0.01 }) => (
        <div className="slider-row" key={key}>
          <label>{label}</label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[key]}
            onChange={(e) => setMaterial(key, parseFloat(e.target.value))}
          />
          <span className="slider-value">{values[key].toFixed(2)}</span>
        </div>
      ))}
    </PanelSection>
  );
}
