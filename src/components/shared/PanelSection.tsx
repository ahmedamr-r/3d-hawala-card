import { useState, type ReactNode } from 'react';

export default function PanelSection({ title, children, defaultOpen = true }: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="panel-section">
      <button className="panel-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="panel-chevron">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="panel-section-body">{children}</div>}
    </div>
  );
}
