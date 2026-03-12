import { useEffect } from 'react';
import Scene from './components/canvas/Scene';
import LeftSidebar from './components/panels/LeftSidebar';
import RightSidebar from './components/panels/RightSidebar';
import { useCardStore } from './store/useCardStore';

export default function App() {
  const theme = useCardStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      <LeftSidebar />
      <main className="canvas-area">
        <Scene />
      </main>
      <RightSidebar />
    </div>
  );
}
