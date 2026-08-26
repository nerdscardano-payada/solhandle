import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { findClaim, normalizeDomain, verifiedStatus } from '../../shared/officialClaim.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const request = await findClaim(base44.asServiceRole.entities.OfficialClaimRequest, body.request_id);
    if (!request || ['rejected', 'minted'].includes(request.status)) return Response.json({ error: 'Claim request not found.' }, { status: 404 });
    if (new Date(request.challenge_expires_at).getTime() <= Date.now()) return Response.json({ error: 'The verification challenge has expired.' }, { status: 410 });
    const domain = normalizeDomain(request.official_domain);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return Response.json({ error: 'Invalid configured official domain.' }, { status: 500 });
    let verified = false;
    try { const response = await fetch(`https://${domain}/.well-known/solhandle-verification.txt`, { redirect: 'follow' }); verified = response.ok && (await response.text()).includes(request.challenge); } catch {}
    if (!verified) {
      const hostname = `_solhandle.${domain}`;
      const resolverUrls = [
        `https://cloudflare-dns.com/dns-query?name=${hostname}&type=TXT&ct=application/dns-json`,
        `https://dns.google/resolve?name=${hostname}&type=TXT&cd=1`
      ];
      for (const url of resolverUrls) {
        try {
          const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/dns-json' } });
          if (!response.ok) continue;
          const data = await response.json();
          verified = Boolean(data.Answer?.some((answer) => String(answer.data || '').replaceAll('"', '').includes(request.challenge)));
          if (verified) break;
        } catch {}
      }
    }
    if (!verified) return Response.json({ verified: false, error: 'Challenge not found on the configured official domain.' }, { status: 422 });
    const domainVerifiedAt = request.domain_verified_at || new Date().toISOString();
    const status = verifiedStatus(true, Boolean(request.wallet_verified_at));
    await base44.asServiceRole.entities.OfficialClaimRequest.update(request.id, { domain_verified_at: domainVerifiedAt, status });
    return Response.json({ verified: true, domainVerified: true, walletVerified: Boolean(request.wallet_verified_at), status });
  } catch (error) { return Response.json({ error: error.message || 'Domain verification failed.' }, { status: 500 }); }
}