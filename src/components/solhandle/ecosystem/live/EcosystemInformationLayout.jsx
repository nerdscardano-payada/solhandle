import { Outlet, useLocation } from 'react-router-dom';
import '@/components/solhandle/ecosystem/live/ecosystem-information.css';
export default function EcosystemInformationLayout() {
  const { pathname } = useLocation();
  const resource = ['/docs', '/demos', '/integrate', '/roadmap'].find(path => pathname === path || pathname.startsWith(`${path}/`));
  const variant = resource ? `el-information-resources el-information-${resource.slice(1)}` : pathname === '/about' ? 'el-information-about' : pathname === '/names' ? 'el-information-names' : '';
  return <div className={`el-information ${variant}`}><Outlet/></div>;
}