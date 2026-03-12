import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';
import CircularDial from '../shared/CircularDial';

const SLIDERS: { key: 'keyLightIntensity' | 'fillLightIntensity' | 'rimLightIntensity'; label: string; max: number }[] = [
  { key: 'keyLightIntensity', label: 'Key Light', max: 5 },
  { key: 'fillLightIntensity', label: 'Fill Light', max: 3 },
  { key: 'rimLightIntensity', label: 'Rim Light', max: 3 },
];

export default function LightingPanel() {
  const keyLightIntensity = useCardStore((s) => s.keyLightIntensity);
  const fillLightIntensity = useCardStore((s) => s.fillLightIntensity);
  const rimLightIntensity = useCardStore((s) => s.rimLightIntensity);
  const keyDirection = useCardStore((s) => s.keyDirection);
  const setLighting = useCardStore((s) => s.setLighting);

  const values = { keyLightIntensity, fillLightIntensity, rimLightIntensity };

  return (
    <PanelSection title="Lighting">
      {SLIDERS.map(({ key, label, max }) => (
        <div className="slider-row" key={key}>
          <label>{label}</label>
          <input
            type="range"
            min="0"
            max={max}
            step="0.1"
            value={values[key]}
            onChange={(e) => setLighting(key, parseFloat(e.target.value))}
          />
          <span className="slider-value">{values[key].toFixed(1)}</span>
        </div>
      ))}
      <div className="dial-row">
        <label>Key Direction</label>
        <CircularDial
          value={keyDirection}
          onChange={(deg) => setLighting('keyDirection', deg)}
        />
        <span className="slider-value">{keyDirection}°</span>
      </div>
    </PanelSection>
  );
}
