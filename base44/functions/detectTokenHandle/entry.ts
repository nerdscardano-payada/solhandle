import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
import { decodeMint, normalizeTokenSymbol } from '../../shared/tokenDetectionCodec.ts';
import { detectMetadata } from '../../shared/tokenDetectionMetadata.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { return Response.json({ error: 'Administrator access required.' }, { status: 403 }); }
    if (user?.role !== 'admin') return Response.json({ error: 'Administrator access required.' }, { status: 403 });
    let body;
    try { body = await req.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
    const input = body?.mint;
    if (typeof input !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input)) return Response.json({ error: 'Enter a valid Solana mint address, not a ticker or token account.' }, { status: 400 });
    let mint;
    try { mint = new PublicKey(input).toBase58(); } catch { return Response.json({ error: 'Invalid Solana mint address.' }, { status: 400 }); }
    const url = secrets.get('SOLANA_RPC_URL');
    if (!url) return Response.json({ error: 'Token detection connection unavailable.' }, { status: 503 });
    if (await rpc(url, 'getGenesisHash') !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') return Response.json({ error: 'Detection requires Solana Mainnet-beta. No results were accepted.' }, { status: 503 });
    const account = await rpc(url, 'getAccountInfo', [mint, { encoding: 'base64', commitment: 'finalized' }]);
    if (!account?.value) return Response.json({ error: 'No account found at this address on Mainnet-beta.' }, { status: 400 });
    let decoded;
    try { decoded = decodeMint(account.value); } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
    const metadata = await detectMetadata(url, mint, decoded, account.context.slot);
    const normalized = metadata.sources.map(source => normalizeTokenSymbol(source.symbol));
    const mismatch = normalized.length > 1 && normalized.some(item => item.candidate !== normalized[0].candidate);
    const selected = normalized[0] || { candidate: null, reason: 'No supported metadata symbol found. Manual review required.' };
    const candidate = mismatch ? null : selected.candidate;
    const warnings = [...metadata.warnings, 'Read-only detection from one configured RPC provider. Authority fields do not prove project ownership.'];
    if (mismatch) warnings.push('Metadata sources disagree on the ticker. No candidate is issued.');
    if (mint === 'So11111111111111111111111111111111111111112') warnings.push('This is wrapped SOL, an SPL token mint. It is not native SOL and cannot establish a native SOL handle.');
    const protectedCandidate = candidate && ['SOL', 'USDC', 'USDT', 'BONK', 'JUP', 'JTO', 'PYTH'].includes(candidate.slice(1));
    return Response.json({
      mint, program: decoded.program, programAddress: account.value.owner, decimals: decoded.decimals, supplyRaw: decoded.supplyRaw,
      mintAuthority: decoded.mintAuthority, freezeAuthority: decoded.freezeAuthority, extensionTypes: decoded.extensions.map(e => e.type),
      candidate, symbolReason: mismatch ? 'Conflicting metadata symbols require manual review.' : selected.reason,
      metadata: metadata.sources, pointer: metadata.pointer, slot: account.context.slot, metadataSlot: metadata.metadataSlot, checkedAt: new Date().toISOString(),
      protection: protectedCandidate ? 'Proposed protected symbol: manual project-identity and ticker-entitlement review required. This is a plan-based flag, not a populated reservation record.' : 'Protection status unknown: the token-specific protected registry is not populated. This result does not establish availability.',
      registry: 'Registration status unknown: the audited token-handle registry is not live. No availability or verified status is asserted.',
      conflicts: 'Global ticker collisions and project identity have not been checked. Existing @ name restrictions are not used as token restrictions.', warnings,
      claimsEnabled: false
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Unable to complete validated token detection. RPC or metadata validation failed; no unverified result is shown. Try again later.' }, { status: 502 });
  }
}