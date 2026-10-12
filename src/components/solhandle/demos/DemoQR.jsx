import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Image } from '@/components/ui/image';
export default function DemoQR({ address }) {
  const [image, setImage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { let active = true; setImage(''); setError(''); QRCode.toDataURL(`solana:${address}`, { width: 300, margin: 2, errorCorrectionLevel: 'M' }).then(url => { if (active) setImage(url); }).catch(() => { if (active) setError('QR generation failed. Use the wallet address instead.'); }); return () => { active = false; }; }, [address]);
  return <div className="space-y-3">{image ? <Image src={image} alt="Solana receive QR for the resolved wallet address" fittingType="fit" className="mx-auto h-56 w-56 max-w-full rounded-xl"/> : <p role="status">{error || 'Generating QR…'}</p>}<p className="text-center text-xs text-muted-foreground">QR encodes the actual resolved wallet, not a mock address. Re-resolve before sending funds.</p></div>;
}