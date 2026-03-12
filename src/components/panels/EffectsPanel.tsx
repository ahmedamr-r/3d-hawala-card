import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';

const EFFECTS: { key: 'dropShadow' | 'floatAnimation' | 'shimmerSweep' | 'lightParallax' | 'metallicEdge'; label: string }[] = [
  { key: 'dropShadow', label: 'Drop Shadow' },
  { key: 'floatAnimation', label: 'Float Animation' },
  { key: 'shimmerSweep', label: 'Shimmer Sweep' },
  { key: 'lightParallax', label: 'Light Parallax' },
  { key: 'metallicEdge', label: 'Metallic Edge Glow' },
];

export default function EffectsPanel() {
  const dropShadow = useCardStore((s) => s.dropShadow);
  const floatAnimation = useCardStore((s) => s.floatAnimation);
  const shimmerSweep = useCardStore((s) => s.shimmerSweep);
  const lightParallax = useCardStore((s) => s.lightParallax);
  const metallicEdge = useCardStore((s) => s.metallicEdge);
  const setEffect = useCardStore((s) => s.setEffect);

  const values = { dropShadow, floatAnimation, shimmerSweep, lightParallax, metallicEdge };

  return (
    <PanelSection title="Effects">
      {EFFECTS.map(({ key, label }) => (
        <div className="toggle-row" key={key}>
          <label>{label}</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={values[key]}
              onChange={(e) => setEffect(key, e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      ))}
    </PanelSection>
  );
}
