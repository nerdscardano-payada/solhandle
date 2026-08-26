import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import bs58 from 'npm:bs58@5.0.0';
import { normalizeHandle, claimMessage, findClaim } from '../../shared/officialClaim.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (body.resume_request_id) {
      const record = await findClaim(base44.asServiceRole.entities.OfficialClaimRequest, body.resume_request_id);
      if (!record || ['rejected', 'minted'].includes(record.status)) return Response.json({ error: 'Claim request not found.' }, { status: 404 });
      return Response.json({ requestId: record.id, handle: record.handle, domain: record.official_domain, challenge: record.challenge, expiresAt: record.challenge_expires_at, recipientWallet: record.recipient_wallet, message: claimMessage(record), highRisk: Boolean(record.high_risk), status: record.status });
    }
    const handle = normalizeHandle(body.handle);
    const required = ['organization', 'contact_name', 'contact_email', 'proof_url', 'recipient_wallet', 'statement'];
    if (!/^[a-z0-9]{1,20}$/.test(handle) || required.some((field) => !String(body[field] || '').trim())) return Response.json({ error: 'Complete every claim field.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.contact_email))) return Response.json({ error: 'Enter a valid work email.' }, { status: 400 });
    try { bs58.decode(String(body.recipient_wallet)); } catch { return Response.json({ error: 'Enter a valid Solana wallet.' }, { status: 400 }); }
    const [policies, restrictions] = await Promise.all([
      base44.asServiceRole.entities.OfficialClaimPolicy.filter({ handle, active: true }, '-updated_date', 1),
      base44.asServiceRole.entities.ProtectedName.filter({ handle, status: 'active' }, '-updated_date', 1)
    ]);
    const restriction = restrictions[0];
    const restrictionType = restriction?.restriction_type || (restriction?.category === 'brand' ? 'PROTECTED' : 'RESERVED');
    if (restrictionType !== 'RESERVED' || restriction?.official_claim_allowed !== true) return Response.json({ error: 'This protected handle is not eligible for an official claim.' }, { status: 409 });
    if (!policies.length) return Response.json({ error: 'No official verification policy is configured for this handle.' }, { status: 409 });
    const policy = policies[0];
    const challenge = `solhandle=${crypto.randomUUID().replaceAll('-', '')}`;
    const challengeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const record = await base44.asServiceRole.entities.OfficialClaimRequest.create({ handle, organization: String(body.organization).trim(), contact_name: String(body.contact_name).trim(), contact_email: String(body.contact_email).trim().toLowerCase(), proof_url: String(body.proof_url).trim(), recipient_wallet: String(body.recipient_wallet).trim(), statement: String(body.statement).trim(), reserved_for: String(body.reserved_for || ''), official_domain: policy.official_domain, challenge, challenge_expires_at: challengeExpiresAt, high_risk: Boolean(policy.high_risk), status: 'pending' });
    return Response.json({ requestId: record.id, domain: policy.official_domain, challenge, expiresAt: challengeExpiresAt, message: claimMessage(record), highRisk: Boolean(policy.high_risk) });
  } catch (error) { return Response.json({ error: error.message || 'Claim could not be started.' }, { status: 500 }); }
}