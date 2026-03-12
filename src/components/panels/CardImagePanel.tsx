import { useCallback } from 'react';
import { useCardStore } from '../../store/useCardStore';
import PanelSection from '../shared/PanelSection';

function ImageDropzone({ label, image, onSet, onClear }: {
  label: string;
  image: string | null;
  onSet: (url: string) => void;
  onClear: () => void;
}) {
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onSet(reader.result as string);
    reader.readAsDataURL(file);
  }, [onSet]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div className="dropzone-wrapper">
      <label className="dropzone-label">{label}</label>
      <div
        className="dropzone"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {image ? (
          <img src={image} alt={label} className="dropzone-preview" />
        ) : (
          <span className="dropzone-placeholder">Drop image or click</span>
        )}
      </div>
      {image && (
        <button className="btn-small btn-danger" onClick={onClear}>Remove</button>
      )}
    </div>
  );
}

export default function CardImagePanel() {
  const frontImage = useCardStore((s) => s.frontImage);
  const backImage = useCardStore((s) => s.backImage);
  const setFrontImage = useCardStore((s) => s.setFrontImage);
  const setBackImage = useCardStore((s) => s.setBackImage);

  return (
    <PanelSection title="Card Images">
      <ImageDropzone
        label="Front"
        image={frontImage}
        onSet={setFrontImage}
        onClear={() => setFrontImage(null)}
      />
      <ImageDropzone
        label="Back"
        image={backImage}
        onSet={setBackImage}
        onClear={() => setBackImage(null)}
      />
    </PanelSection>
  );
}
