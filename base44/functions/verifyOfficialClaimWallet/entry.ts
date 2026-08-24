import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@5.0.0';
import { claimMessage, findClaim, verifiedStatus } from '../../shared/officialClaim.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const request = await findClaim(base44.asServiceRole.entities.OfficialClaimRequest, body.request_id);
    if (!request || ['rejected', 'minted'].includes(request.status)) return Response.json({ error: 'Claim request not found.' }, { status: 404 });
    if (new Date(request.challenge_expires_at).getTime() <= Date.now()) return Response.json({ error: 'The verification challenge has expired.' }, { status: 410 });
    const signature = Uint8Array.from(atob(String(body.signature_base64 || '')), (character) => character.charCodeAt(0));
    const publicKey = bs58.decode(request.recipient_wallet);
    const message = new TextEncoder().encode(claimMessage(request));
    if (signature.length !== 64 || publicKey.length !== 32 || !nacl.sign.detached.verify(message, signature, publicKey)) return Response.json({ error: 'Wallet signature is invalid.' }, { status: 422 });
    const walletVerifiedAt = request.wallet_verified_at || new Date().toISOString();
    const status = verifiedStatus(Boolean(request.domain_verified_at), true);
    await base44.asServiceRole.entities.OfficialClaimRequest.update(request.id, { wallet_verified_at: walletVerifiedAt, wallet_signature: String(body.signature_base64), status });
    return Response.json({ verified: true, domainVerified: Boolean(request.domain_verified_at), walletVerified: true, status });
  } catch (error) { return Response.json({ error: error.message || 'Wallet verification failed.' }, { status: 500 }); }
}