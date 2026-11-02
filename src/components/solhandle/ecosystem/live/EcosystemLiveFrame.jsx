import { Outlet, useLocation } from 'react-router-dom';
import EcosystemFrameContext from '@/components/solhandle/ecosystem/live/EcosystemFrameContext';
import EcosystemLiveHeader from '@/components/solhandle/ecosystem/live/EcosystemLiveHeader';
import EcosystemLiveNavigation from '@/components/solhandle/ecosystem/live/EcosystemLiveNavigation';
import EcosystemLiveFooter from '@/components/solhandle/ecosystem/live/EcosystemLiveFooter';
import EcosystemCityTransition from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
import '@/components/solhandle/ecosystem/ecosystem-preview.css';
import '@/components/solhandle/ecosystem/live/ecosystem-live.css';
import '@/components/solhandle/ecosystem/live/ecosystem-mobile-layout.css';
import '@/components/solhandle/ecosystem/live/home-mobile-header-hero.css';
import MobileAppDock from '@/components/solhandle/ecosystem/live/MobileAppDock';
import '@/components/solhandle/ecosystem/live/mobile-app-shell.css';
import '@/components/solhandle/ecosystem/live/mobile-home-content.css';
import '@/components/solhandle/ecosystem/live/mobile-secondary-content.css';
export default function EcosystemLiveFrame() {
  const { pathname } = useLocation();
  const publicPage = pathname === '/';
  const mobileApp = !pathname.startsWith('/admin');
  return <EcosystemCityTransition><EcosystemFrameContext><div className={`eco-preview eco-live ecosystem-tokens dark${publicPage ? ' el-home-fullwidth' : ''}${mobileApp ? ' el-mobile-app' : ''}`} lang="en" translate="no" data-no-translate><div className="ep-viewport"><div className={`ep-app ${publicPage ? 'ep-public-app' : ''}`}><EcosystemLiveHeader/>{publicPage ? <Outlet/> : <div className="ep-app-layout"><EcosystemLiveNavigation/><div className="ep-main el-module"><Outlet/></div></div>}<EcosystemLiveFooter/>{mobileApp ? <MobileAppDock/> : !publicPage && <EcosystemLiveNavigation mobile/>}</div></div></div></EcosystemFrameContext></EcosystemCityTransition>;
}