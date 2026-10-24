import { Outlet, useLocation } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import usePresentationMobile from '@/components/solhandle/design/usePresentationMobile';
import NetworkPresentationHeader from '@/components/solhandle/network/NetworkPresentationHeader';
import NetworkPresentationSidebar from '@/components/solhandle/network/NetworkPresentationSidebar';
import NetworkPresentationNavigation from '@/components/solhandle/network/NetworkPresentationNavigation';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';

export default function NetworkShell() {
  const { theme } = useNetworkTheme();
  const mobile = usePresentationMobile();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const sections = ['/network', '/network/discover', '/network/connections', '/network/search', '/network/notifications', '/network/bookmarks', '/network/access', '/network/lab'];
  const profileView = params.has('profile') || params.get('view') === 'profile' || pathname === '/network/me' || pathname.startsWith('/network/account/') || (!sections.includes(pathname) && /^\/network\/[^/]+$/.test(pathname));
  return <div data-social-theme={theme} data-mode={theme} className="network-surface sol-design network-preview-parity"><div className={`sd-frame sd-network-frame ${mobile ? 'sd-phone' : ''} ${profileView ? 'sd-profile-frame' : ''}`}><div className="sd-screen">{!profileView && <><Image className="sd-network-city" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="" aria-hidden="true" focalPointX={0.75}/><div className="sd-network-shade"/></>}<NetworkPresentationHeader/><div className="sd-app-layout"><NetworkPresentationSidebar/><main id="social-content" className="sd-main"><Outlet/></main></div><NetworkPresentationNavigation bottom/></div></div></div>;
}