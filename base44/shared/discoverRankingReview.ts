import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { resolveOnChain } from './solhandleResolver.ts';
import { expiredRankingDate } from './discoverRankingChecks.ts';

const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
function evidenceUrl(value) {
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password && url.hostname.includes('.') && value.length <= 500) return url.href; } catch {}
  return invalid('Provide a public HTTPS evidence link, not a private document or signature.');
}
export async function reviewDiscoverRanking(db, listing, body, rpcUrl) {
  const kind = body.action.endsWith('integration') ? 'integration' : 'handle';
  if (body.action.startsWith('revoke_')) return db.NetworkProject.update(listing.id, { [`${kind}_valid_until`]: expiredRankingDate, ...(kind === 'handle' ? { handle_check_status: 'INACTIVE' } : {}) });
  if (body.confirmed !== true) return invalid('Confirm that you personally reviewed the required evidence.');
  const until = Date.parse(body.valid_until), now = Date.now();
  if (!Number.isFinite(until) || until <= now || until > now + 366 * 86400000) return invalid('Choose a future review expiry within one year.');
  const patch = { [`${kind}_valid_until`]: new Date(until).toISOString(), [`${kind}_reviewed_at`]: new Date(now).toISOString(), [`${kind}_evidence_url`]: evidenceUrl(body.evidence_url), [`${kind}_reviewed_website`]: listing.website };
  if (kind === 'handle') {
    if (!/^@[a-z0-9]{1,20}$/.test(listing.handle || '')) return invalid('Save a valid handle on the listing first.');
    if (!Number.isInteger(body.interval_hours) || body.interval_hours < 1 || body.interval_hours > 720) return invalid('Set the ownership check interval from 1 to 720 hours.');
    let wallet; try { wallet = new PublicKey(body.wallet).toBase58(); } catch { return invalid('Provide the wallet whose control you reviewed.'); }
    let resolved; try { resolved = await resolveOnChain(rpcUrl, listing.handle); } catch { throw Object.assign(new Error('Live ownership could not be checked. No new ranking benefit has been granted.'), { status: 503 }); }
    if (!resolved || resolved.address !== wallet) return invalid('This wallet does not currently own the official SolHandle NFT.');
    Object.assign(patch, { handle_owner_wallet: wallet, handle_verified_asset: resolved.assetAddress, handle_reviewed_handle: listing.handle, handle_check_status: 'ACTIVE', handle_checked_at: new Date().toISOString(), handle_check_interval_hours: body.interval_hours, handle_check_due_at: new Date(Date.now() + body.interval_hours * 3600000).toISOString() });
  }
  const latest = await db.NetworkProject.get(listing.id);
  if (latest.updated_date !== listing.updated_date) throw Object.assign(new Error('The listing changed. Reload it before approving ranking.'), { status: 409 });
  return db.NetworkProject.update(listing.id, patch);
}