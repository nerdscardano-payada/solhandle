export const projectCategories = { WALLET: 'Wallets', DEFI: 'DeFi', NFT: 'NFTs', INFRASTRUCTURE: 'Infrastructure', GAMING: 'Gaming', COMMUNITY: 'Community', OTHER: 'Other' };
export const listingTypes = { PROJECT: 'Projects', BUILDER: 'Builders', PERSON: 'People' };
export const projectFields = ['name', 'summary', 'description', 'category', 'website', 'status', 'listing_type', 'expertise', 'social_links', 'handle', 'product_status', 'featured', 'pfp_url', 'banner_url'];
export const projectError = error => error.response?.data?.error || error.message || 'The project could not be saved.';
export function projectQuery({ admin = false, q = '', status = 'ALL', category = 'ALL', type = 'ALL', expertise = '', featured = false }) {
  const escaped = q.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = [!admin ? { status: 'PUBLISHED' } : status !== 'ALL' ? { status } : {}];
  if (category !== 'ALL') parts.push({ category });
  if (type === 'PROJECT') parts.push({ $or: [{ listing_type: 'PROJECT' }, { listing_type: { $exists: false } }] });
  else if (type !== 'ALL') parts.push({ listing_type: type });
  if (expertise) parts.push({ expertise: { $regex: expertise.slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });
  if (featured) parts.push({ featured: true });
  if (escaped) parts.push({ $or: ['name', 'summary', 'expertise', 'handle'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } })) });
  return { $and: parts };
}
export function projectInput(values) {
  const data = Object.fromEntries(['name', 'summary', 'description', 'category', 'website', 'status', 'expertise', 'handle'].map(field => [field, String(values[field] || '').trim()]));
  for (const key of ['pfp_url','banner_url']) {
    const value = String(values[key] || '').trim();
    if (!/^https:\/\/[^\s]+$/.test(value) || value.length > 2048) throw new Error('A profile picture and banner image are required. Upload both images before saving.');
    data[key] = value;
  }
  data.listing_type = values.listing_type || 'PROJECT';
  data.product_status = values.product_status || 'LIVE';
  data.featured = !!values.featured;
  data.social_links = String(values.social_links_text || '').split('\n').map(link => link.trim()).filter(Boolean);
  if (!listingTypes[data.listing_type] || !['BUILDING', 'LIVE', 'PAUSED'].includes(data.product_status) || data.expertise.length > 120 || (data.handle && !/^@[a-z0-9]{1,20}$/.test(data.handle))) throw new Error('Check the listing type, expertise, status and handle.');
  if (data.social_links.length > 5 || data.social_links.some(link => { try { const url = new URL(link); return url.protocol !== 'https:' || !!url.username || !!url.password || link.length > 500; } catch { return true; } })) throw new Error('Enter up to five valid HTTPS social links without credentials.');
  if (!data.name || data.name.length > 80 || !data.summary || data.summary.length > 240 || data.description.length > 3000) throw new Error('Check the project name, summary and description lengths.');
  if (!projectCategories[data.category] || !['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(data.status)) throw new Error('Choose a category and publication status.');
  let url;
  try { url = new URL(data.website); } catch { throw new Error('Enter a valid HTTPS website.'); }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || data.website.length > 500) throw new Error('Use an HTTPS website without embedded credentials.');
  return { ...data, website: url.href };
}