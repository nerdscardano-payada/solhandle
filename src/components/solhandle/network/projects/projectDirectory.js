export const projectCategories = { WALLET: 'Wallets', DEFI: 'DeFi', NFT: 'NFTs', INFRASTRUCTURE: 'Infrastructure', GAMING: 'Gaming', COMMUNITY: 'Community', OTHER: 'Other' };
export const projectFields = ['name', 'summary', 'description', 'category', 'website', 'status'];
export const projectError = error => error.response?.data?.error || error.message || 'The project could not be saved.';
export function projectQuery({ admin = false, q = '', status = 'ALL', category = 'ALL' }) {
  const escaped = q.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    ...(!admin ? { status: 'PUBLISHED' } : status !== 'ALL' ? { status } : {}),
    ...(category !== 'ALL' ? { category } : {}),
    ...(escaped ? { $or: [{ name: { $regex: escaped, $options: 'i' } }, { summary: { $regex: escaped, $options: 'i' } }] } : {})
  };
}
export function projectInput(values) {
  const data = Object.fromEntries(projectFields.map(field => [field, String(values[field] || '').trim()]));
  if (!data.name || data.name.length > 80 || !data.summary || data.summary.length > 240 || data.description.length > 3000) throw new Error('Check the project name, summary and description lengths.');
  if (!projectCategories[data.category] || !['DRAFT', 'PUBLISHED'].includes(data.status)) throw new Error('Choose a category and publication status.');
  let url;
  try { url = new URL(data.website); } catch { throw new Error('Enter a valid HTTPS website.'); }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || data.website.length > 500) throw new Error('Use an HTTPS website without embedded credentials.');
  return { ...data, website: url.href };
}