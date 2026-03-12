import { useRef, useCallback } from 'react';

export default function CircularDial({ value, onChange }: {
  value: number;
  onChange: (deg: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleInteraction = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    let deg = (angle * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    onChange(Math.round(deg));
  }, [onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    handleInteraction(e);
  }, [handleInteraction]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons > 0) {
      handleInteraction(e);
    }
  }, [handleInteraction]);

  const rad = ((value - 90) * Math.PI) / 180;
  const indicatorX = 40 + Math.cos(rad) * 30;
  const indicatorY = 40 + Math.sin(rad) * 30;

  return (
    <svg
      ref={svgRef}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="circular-dial"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--h-border-border-secondary)" strokeWidth="2" />
      <circle cx="40" cy="40" r="3" fill="var(--h-content-content-tertiary)" />
      <line x1="40" y1="40" x2={indicatorX} y2={indicatorY} stroke="var(--accent)" strokeWidth="2" />
      <circle cx={indicatorX} cy={indicatorY} r="5" fill="var(--accent)" />
    </svg>
  );
}
