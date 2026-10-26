import { Outlet, useLocation } from 'react-router-dom';
import '@/components/solhandle/ecosystem/live/ecosystem-information.css';
export default function EcosystemInformationLayout() {
  const { pathname } = useLocation();
  const resource = ['/docs', '/demos', '/integrate', '/roadmap', '/developers/partner-mint', '/protocol-paper'].find(path => pathname === path || pathname.startsWith(`${path}/`));
  const utility = ['/statistics', '/last-minted', '/directory', '/protected-brands'].includes(pathname);
  const variant = resource ? `el-information-resources el-information-${resource.slice(1).replaceAll('/', '-')}` : utility ? 'el-information-utility' : pathname === '/about' ? 'el-information-about' : pathname === '/names' ? 'el-information-names' : '';
  return <div className={`el-information ${variant}`}><Outlet/></div>;
}