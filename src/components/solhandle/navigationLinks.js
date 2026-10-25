export const growthHubVisible = false;
export const canViewNavigationLink = (path, user) => {
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  const adminOnly = pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/mint' || pathname.startsWith('/developers/partner-mint');
  return pathname !== '/android' && (!adminOnly || user?.role === 'admin');
};
export const tokenLinks = [['Trade $HANDLE', '/upcoming/token-launch'], ...(growthHubVisible ? [['Growth Hub', '/quests']] : []), ['Growth Curve', '/growth'], ['Flywheel', '/flywheel'], ['Burn Dashboard', '/growth/burn']];
export const aboutLinks = [['About / How it works', '/about'], ['FAQ', '/faq'], ['Roadmap', '/roadmap'], ['Brand Protection', '/protected-brands'], ['Contact', '/contact']];
export const developerLinks = [['Demo Lab', '/demos'], ['Integrate SolHandle', '/integrations'], ['Integration Onboarding', '/integrate'], ['SDK / API', '/developers'], ['Partner Mint Plan', '/developers/partner-mint'], ['Documentation', '/docs']];
export const legalLinks = [['Legal notice & disclaimer', '/legal'], ['Privacy policy', '/privacy']];
export const communityLinks = [['X · @Solhandle', 'https://x.com/Solhandle'], ['Discord · Join the community', 'https://discord.gg/xYbZ9Gb5Jx']];
export const mobileGroups = [
  ['Use SolHandle', [['SolHandle Network', '/network'], ['Pay', '/pay'], ['Android app', '/android'], ['Live integrations', '/live-integrations']]],
  ['Discover names', [['Premium Directory', '/directory'], ['Handle Wheel', '/fun']]],
  ['$HANDLE & Growth', tokenLinks],
  ['Developers', developerLinks],
  ['About & Support', aboutLinks],
  ['Legal', legalLinks],
];
export const footerGroups = [
  ['Use SolHandle', [['SolHandle Network', '/network'], ['Search handles', '/search'], ['Discover names', '/names'], ['Marketplace', '/market'], ['My Handles', '/my-handles'], ['Pay', '/pay'], ['Android app', '/android'], ['Live integrations', '/live-integrations']]],
  ['$HANDLE & Growth', tokenLinks],
  ['Developers', developerLinks],
  ['About & Support', aboutLinks],
  ['Legal', legalLinks],
];