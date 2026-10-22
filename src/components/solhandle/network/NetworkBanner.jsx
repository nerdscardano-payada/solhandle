import { Image } from '@/components/ui/image';
const cover = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/3fec706fa_generated_image.png';
export default function NetworkBanner({ compact = false, children }) {
  return <div className={`network-cover ${compact ? 'network-cover-compact' : ''}`}><Image src={cover} alt="" className="h-full w-full" focalPointY={0.48}/><div className="network-cover-shade"/>{!compact && <div className="network-cover-signature" aria-hidden="true">YOUR IDENTITY.<br/>YOUR WALLET.<br/>YOUR WORLD.<span>SOLHANDLE NETWORK</span></div>}{children}</div>;
}