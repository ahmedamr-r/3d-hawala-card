import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';
import ColorPicker, { DARK_SWATCHES, LIGHT_SWATCHES } from '../shared/ColorPicker';

export default function BackgroundPanel() {
  const backgroundColor = useCardStore((s) => s.backgroundColor);
  const setBackgroundColor = useCardStore((s) => s.setBackgroundColor);
  const useDefaultBg = useCardStore((s) => s.useDefaultBg);
  const setUseDefaultBg = useCardStore((s) => s.setUseDefaultBg);
  const theme = useCardStore((s) => s.theme);

  return (
    <PanelSection title="Background">
      <div className="bg-mode-row">
        <button
          className={`preset-btn small${useDefaultBg ? ' active' : ''}`}
          onClick={() => setUseDefaultBg(true)}
        >
          Default
        </button>
        <button
          className={`preset-btn small${!useDefaultBg ? ' active' : ''}`}
          onClick={() => setUseDefaultBg(false)}
        >
          Custom
        </button>
      </div>
      {!useDefaultBg && (
        <ColorPicker
          value={backgroundColor}
          onChange={setBackgroundColor}
          swatches={theme === 'dark' ? DARK_SWATCHES : LIGHT_SWATCHES}
        />
      )}
    </PanelSection>
  );
}
