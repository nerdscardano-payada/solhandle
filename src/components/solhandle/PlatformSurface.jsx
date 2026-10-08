import { useLocation } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import '@/components/solhandle/platform-theme.css';

export default function PlatformSurface({ children }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/widgets/')) return children;
  const home = pathname === '/';
  return <div className={`platform-shell ${home ? 'platform-home' : 'platform-inner'}`}>
    {!home && <div className="platform-backdrop" aria-hidden="true">
      <Image src="https://cdn.wegic.ai/assets/onepage/agent/reference-assets/cosmic-hero-bg-01M4D6CE612GE314R7S18MGQQE-enhanced.png" alt="" fittingType="fill" className="platform-backdrop-image" loading="eager"/>
      <div className="platform-backdrop-tint"/>
    </div>}
    <div className="platform-page-content">{children}</div>
  </div>;
}