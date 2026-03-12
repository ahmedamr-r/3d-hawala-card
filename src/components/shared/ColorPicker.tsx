const DARK_SWATCHES = [
  '#0A0A09', '#1C180D', '#2A2926', '#3C3D42',
  '#141413', '#5E5C5B', '#4E2112', '#662D1B',
  '#0E2400', '#5C1800', '#4A130F', '#163300',
];

const LIGHT_SWATCHES = [
  '#FFFFFF', '#FAF9F5', '#F5F4F0', '#F1EEE7',
  '#E8E6E1', '#E0DED8', '#FFF5F0', '#FFF0EB',
  '#E8F5E9', '#FFF0C8', '#FDEEE8', '#C8E6C9',
];

export default function ColorPicker({ value, onChange, swatches }: {
  value: string;
  onChange: (color: string) => void;
  swatches?: string[];
}) {
  const colors = swatches ?? DARK_SWATCHES;

  return (
    <div className="color-swatches">
      {colors.map((color) => (
        <button
          key={color}
          className={`color-swatch ${value === color ? 'active' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-input"
      />
    </div>
  );
}

export { DARK_SWATCHES, LIGHT_SWATCHES };
