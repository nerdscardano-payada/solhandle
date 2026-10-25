import { Outlet, useLocation } from 'react-router-dom';
import '@/components/solhandle/ecosystem/live/ecosystem-information.css';
export default function EcosystemInformationLayout() {
  const { pathname } = useLocation();
  const variant = pathname === '/about' ? 'el-information-about' : pathname === '/names' ? 'el-information-names' : '';
  return <div className={`el-information ${variant}`}><Outlet/></div>;
}