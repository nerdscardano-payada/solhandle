import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import '@/components/solhandle/brand.css';

const logo = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/3e0f7ad5c_ChatGPTImage2sep202620_01_571.png';

export default function Brand({ prominent = false }) {
  return <Link to="/" aria-label="SolHandle homepage" className={prominent ? 'solhandle-menu-brand solhandle-menu-brand-prominent' : 'solhandle-menu-brand'}>
    <span className="solhandle-menu-mark"><Image src={logo} alt="" className="solhandle-menu-mark-image" fittingType="fit" loading="eager"/></span>
    <span className="solhandle-menu-wordmark"><Image src={logo} alt="SolHandle — Your @ on Solana." className="solhandle-menu-wordmark-image" fittingType="fit" loading="eager"/></span>
  </Link>;
}