import { useLocation } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import MobileAppNavigation from '@/components/solhandle/MobileAppNavigation';
import '@/components/solhandle/platform-theme.css';
import '@/components/solhandle/mobile-app.css';

export default function PlatformSurface({ children }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/widgets/')) return children;
  const home = pathname === '/';
  const appNavigation = !['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname) && !pathname.startsWith('/admin');
  return <div className={`platform-shell ${home ? 'platform-home' : 'platform-inner'} ${appNavigation ? 'has-app-navigation' : ''}`}>
    {!home && <div className="platform-backdrop" aria-hidden="true">
      <Image src="https://cdn.wegic.ai/assets/onepage/agent/reference-assets/cosmic-hero-bg-01M4D6CE612GE314R7S18MGQQE-enhanced.png" alt="" fittingType="fill" className="platform-backdrop-image" loading="eager"/>
      <div className="platform-backdrop-tint"/>
    </div>}
    <div className="platform-page-content">{children}</div>
    {appNavigation && <MobileAppNavigation/>}
  </div>;
}