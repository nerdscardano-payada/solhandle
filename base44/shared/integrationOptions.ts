export const options = {
  contact_role: ['Founder','Developer','Product','Business Development','Community','Other'],
  product_types: ['Wallet','Payments','Trading','DeFi','Marketplace','Explorer','Creator platform','Gaming','DAO / Governance','Social / Community','Merchant / Commerce','Developer infrastructure','Other'],
  use_cases: ['Display @ identities','Resolve @ → wallet','Payments to @','Reverse resolution','Creator / project identity','Partner Mint','Merchant payments','Not sure yet'],
  network: ['Solana Mainnet','Solana Devnet','Both','Not live yet'],
  tech_stack: ['React','Next.js','React Native','Mobile native','Other','Not sure'],
  integration_preference: ['REST API','SDK','On-chain','Embedded component','Partner Mint','Not sure'],
  project_stage: ['Idea','Building','Beta','Live'],
};
export const statuses = ['NEW','REVIEWING','FIT_FOUND','CONTACTED','REPLIED','TECH_REVIEW','BUILDING','TESTING','LIVE','NOT_A_FIT','NO_RESPONSE'];
export function fail(message, status = 400) { throw Object.assign(new Error(message), { status }); }
export async function digest(value) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), x => x.toString(16).padStart(2,'0')).join(''); }
export function capability(value) { if (typeof value !== 'string' || !/^[a-f0-9-]{36}$/.test(value)) fail('Invalid receipt code.'); return value; }
export function text(value, name, max = 200, required = false) {
  if (value != null && typeof value !== 'string') fail(`Invalid ${name}.`);
  const clean = (value || '').trim().normalize('NFC');
  if ((required && !clean) || clean.length > max || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(clean)) fail(`Check ${name}; plain text only, maximum ${max} characters.`);
  return clean;
}
export function url(value, required = false) {
  const input = text(value, 'URL', 500, required); if (!input) return '';
  let parsed; try { parsed = new URL(input.includes('://') ? input : `https://${input}`); } catch { fail('Enter a valid website URL.'); }
  if (!['https:','http:'].includes(parsed.protocol) || parsed.username || parsed.password || !parsed.hostname.includes('.') || parsed.hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname) || parsed.hostname.endsWith('.local')) fail('Use a public http(s) website URL.');
  return parsed.href;
}
export function projectKey(value) { const u = new URL(value), host = u.hostname.toLowerCase().replace(/^www\./,''); return ['x.com','twitter.com'].includes(host) ? `x.com/${u.pathname.split('/').filter(Boolean)[0]?.toLowerCase() || ''}` : host; }
export function choice(value, key) { if (!options[key].includes(value)) fail(`Choose ${key.replaceAll('_',' ')}.`); return value; }
export function choices(value, key) { if (!Array.isArray(value) || !value.length || value.length > options[key].length || value.some(x => !options[key].includes(x))) fail(`Choose ${key.replaceAll('_',' ')}.`); return [...new Set(value)]; }
export function email(value) { const v = text(value,'email',254,true).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) fail('Enter a valid contact email.'); return v; }