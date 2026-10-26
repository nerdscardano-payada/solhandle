export const ecosystemInformationPaths = ['/about', '/names', '/developers', '/developers/partner-mint', '/integrations', '/faq', '/contact', '/privacy', '/legal', '/docs', '/demos', '/integrate', '/roadmap', '/statistics', '/last-minted', '/directory', '/protected-brands', '/upcoming/token-launch'];
export const isEcosystemInformationPath = path => ecosystemInformationPaths.includes(path) || path.startsWith('/demos/');
export const ecosystemPaths = ['/', '/ecosystem', '/discover', '/profiles', '/discover/submit', '/admin', '/admin/projects', '/search', '/profile', '/my-handles', '/contacts', '/pay', '/receive', ...ecosystemInformationPaths];
// Static destinations outside the Ecosystem shell must not be mistaken for /:handle.
const legacyTopLevelPaths = new Set(['/android', '/network', '/mint-weekend', '/mint', '/upcoming', '/promo', '/protocol-paper', '/quests', '/earn', '/earn-litepaper', '/leaderboard', '/referral-terms', '/live-integrations', '/fun', '/explore', '/directory', '/market', '/marketplace-recovery', '/statistics', '/last-minted', '/protected-brands', '/login', '/register', '/forgot-password', '/reset-password', '/discord-verify', '/mint-success', '/growth', '/flywheel', '/ecosystem-preview', '/design-preview']);
export const isEcosystemHandlePath = path => /^\/[^/]+\/?$/.test(path) && !legacyTopLevelPaths.has(path.replace(/\/$/, '').toLowerCase());
export const isEcosystemPath = path => (path.startsWith('/admin/') && path !== '/admin/referrals') || ecosystemPaths.includes(path) || isEcosystemHandlePath(path) || path.startsWith('/profile/') || path.startsWith('/discover/projects/') || path.startsWith('/demos/');
export const ecosystemAssets = {
  logo: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png',
  city: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png'
};