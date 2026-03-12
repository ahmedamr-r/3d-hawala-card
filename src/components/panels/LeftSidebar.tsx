import ShotPresetsPanel from './ShotPresetsPanel';
import CardImagePanel from './CardImagePanel';
import IconPickerPanel from './IconPickerPanel';
import OverlayEditorPanel from './OverlayEditorPanel';
import BackgroundPanel from './BackgroundPanel';
import { useCardStore } from '../../store/useCardStore';

export default function LeftSidebar() {
  const theme = useCardStore((s) => s.theme);
  const toggleTheme = useCardStore((s) => s.toggleTheme);

  return (
    <aside className="sidebar left-sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">3D Card Studio</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '☽'}
        </button>
      </div>
      <div className="sidebar-scroll">
        <ShotPresetsPanel />
        <CardImagePanel />
        <IconPickerPanel />
        <OverlayEditorPanel />
        <BackgroundPanel />
      </div>
    </aside>
  );
}
