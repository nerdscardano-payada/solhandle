import { useState } from 'react';
import { Image } from '@/components/ui/image';
import { Camera } from 'lucide-react';

export default function PreviewProfileImageField({ label, value, onChange, banner = false }) {
  const [error, setError] = useState('');
  const select = event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Kies een JPG, PNG of WebP van maximaal 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError('Deze afbeelding kon niet worden gelezen.');
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => setError('Kies een geldige afbeelding.');
      image.onload = () => { onChange(reader.result); setError(''); };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  return <div className="sd-edit-image-field"><span>{label}</span><div className={banner ? 'sd-edit-image sd-edit-banner' : 'sd-edit-image sd-edit-avatar'}>{value ? <Image src={value} alt={`${label} voorbeeld`} className="sd-edit-image-content"/> : <Camera size={24} aria-hidden="true"/>}</div><label className="sd-button sd-secondary">Afbeelding kiezen<input type="file" accept="image/jpeg,image/png,image/webp" onChange={select}/></label>{value && <button type="button" className="sd-text-button" onClick={() => onChange('')}>Verwijderen</button>}{error && <small role="alert">{error}</small>}</div>;
}