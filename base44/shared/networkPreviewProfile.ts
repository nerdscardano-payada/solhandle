export function previewProfileInput(input) {
  const name = String(input.display_name || '').trim();
  const bio = String(input.bio || '').trim();
  if (!name || name.length > 80 || bio.length > 500) throw new Error('Enter a name up to 80 characters and a bio up to 500 characters.');
  if (!['PERSON', 'CREATOR', 'PROJECT'].includes(input.kind)) throw new Error('Invalid profile type.');
  if (!['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(input.status)) throw new Error('Invalid publication state.');
  const links = Array.isArray(input.social_links) ? input.social_links : [];
  if (links.length > 5) throw new Error('Maximum five social links.');
  const safeLinks = links.map(link => {
    if (typeof link !== 'string' || link.length > 500) throw new Error('Invalid social link.');
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Social links must use HTTPS without credentials.');
    return url.href;
  });
  return { display_name: name, bio, kind: input.kind, status: input.status, social_links: safeLinks, preview: true };
}