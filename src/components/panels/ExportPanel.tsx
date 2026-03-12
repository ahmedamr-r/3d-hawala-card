import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';

export default function ExportPanel() {
  const exportScale = useCardStore((s) => s.exportScale);
  const setExportScale = useCardStore((s) => s.setExportScale);
  const transparentBg = useCardStore((s) => s.transparentBg);
  const setTransparentBg = useCardStore((s) => s.setTransparentBg);

  const handleExport = () => {
    // Find the canvas element from R3F
    const canvas = document.querySelector('.canvas-area canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `card-${exportScale}x.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <PanelSection title="Export">
      <div className="slider-row">
        <label>Resolution</label>
        <div className="resolution-btns">
          {([1, 2, 3, 4] as const).map((scale) => (
            <button
              key={scale}
              className={`preset-btn small ${exportScale === scale ? 'active' : ''}`}
              onClick={() => setExportScale(scale)}
            >
              {scale}x
            </button>
          ))}
        </div>
      </div>
      <div className="toggle-row">
        <label>Transparent BG</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={transparentBg}
            onChange={(e) => setTransparentBg(e.target.checked)}
          />
          <span className="switch-slider" />
        </label>
      </div>
      <button className="btn-export" onClick={handleExport}>
        Download PNG
      </button>
    </PanelSection>
  );
}
