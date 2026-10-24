import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';

export default function NetworkBrand() {
  return <Link to="/" className="social-brand" aria-label="SolHandle homepage">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png" alt="" fittingType="fit" className="social-brand-image"/>
    <span>SolHandle<span className="text-names-secondary">.</span></span>
  </Link>;
}