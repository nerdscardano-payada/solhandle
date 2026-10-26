import { Outlet, useLocation } from 'react-router-dom';
import EcosystemFrameContext from '@/components/solhandle/ecosystem/live/EcosystemFrameContext';
import EcosystemLiveHeader from '@/components/solhandle/ecosystem/live/EcosystemLiveHeader';
import EcosystemLiveNavigation from '@/components/solhandle/ecosystem/live/EcosystemLiveNavigation';
import EcosystemLiveFooter from '@/components/solhandle/ecosystem/live/EcosystemLiveFooter';
import EcosystemCityTransition from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
import '@/components/solhandle/ecosystem/ecosystem-preview.css';
import '@/components/solhandle/ecosystem/live/ecosystem-live.css';
export default function EcosystemLiveFrame() {
  const publicPage = useLocation().pathname === '/';
  return <EcosystemCityTransition><EcosystemFrameContext><div className="eco-preview eco-live ecosystem-tokens dark" lang="en" translate="no" data-no-translate><div className="ep-viewport"><div className={`ep-app ${publicPage ? 'ep-public-app' : ''}`}><EcosystemLiveHeader/>{publicPage ? <Outlet/> : <div className="ep-app-layout"><EcosystemLiveNavigation/><div className="ep-main el-module"><Outlet/></div></div>}<EcosystemLiveFooter/>{!publicPage && <EcosystemLiveNavigation mobile/>}</div></div></div></EcosystemFrameContext></EcosystemCityTransition>;
}