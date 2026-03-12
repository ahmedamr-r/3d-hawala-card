import MaterialPanel from './MaterialPanel';
import LightingPanel from './LightingPanel';
import EffectsPanel from './EffectsPanel';
import ExportPanel from './ExportPanel';

export default function RightSidebar() {
  return (
    <aside className="sidebar right-sidebar">
      <div className="sidebar-scroll">
        <MaterialPanel />
        <LightingPanel />
        <EffectsPanel />
        <ExportPanel />
      </div>
    </aside>
  );
}
