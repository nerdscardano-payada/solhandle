import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { Keypair, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@5.0.0';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
import { normalizeHandle } from '../../shared/handlePricing.ts';
import { PROGRAM_ID } from '../../shared/solhandleProtocol.ts';

const HANDLE_MINT = 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump';
const WSOL = 'So11111111111111111111111111111111111111112';
const TOKEN_PROGRAMS = new Set(['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']);
const encodeBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
function loadSigner() {
  try {
    const value = secrets.get('HANDLE_QUOTE_SIGNER_KEYPAIR') || '';
    const parsed = value.trim().startsWith('[') ? JSON.parse(value) : null;
    if (parsed && (!Array.isArray(parsed) || parsed.some(byte => !Number.isInteger(byte) || byte < 0 || byte > 255))) throw new Error('Invalid bytes');
    const bytes = parsed ? Uint8Array.from(parsed) : bs58.decode(value.trim());
    if (bytes.length === 32) return Keypair.fromSeed(bytes);
    if (bytes.length === 64) return Keypair.fromSecretKey(bytes);
    throw new Error('Invalid length');
  } catch { throw new Error('The payment quote signer must be a valid 32-byte seed or 64-byte keypair (base58 or JSON array).'); }
}

export default async function(req: Request): Promise<Response> {
  try {
    const { handle: rawHandle, wallet: rawWallet, action } = await req.json();
    if (action === 'signer') {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      if (user?.role !== 'admin') return Response.json({ error: 'Forbidden.' }, { status: 403 });
      return Response.json({ publicKey: loadSigner().publicKey.toBase58(), tokenMint: HANDLE_MINT });
    }
    if (action !== 'preview' && action !== 'sign') return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    const handle = normalizeHandle(rawHandle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: 'Invalid handle.' }, { status: 400 });
    let wallet;
    try { wallet = new PublicKey(String(rawWallet || '')).toBase58(); }
    catch { return Response.json({ error: 'Connect a valid Solana wallet.' }, { status: 400 }); }
    const key = secrets.get('JUPITER_API_KEY');
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (!key || !rpcUrl) throw new Error('Token payment quoting is not configured.');

    // The public availability endpoint must have verified the name on-chain; never sign from an index-only fallback.
    const base44 = createClientFromRequest(req);
    const availabilityResponse = await base44.functions.invoke('getHandleAvailability', { handle });
    const availability = availabilityResponse.data;
    if (!availability?.available || availability.verificationSource !== 'blockchain' || availability.handle !== handle) {
      return Response.json({ error: 'This handle is unavailable or could not be verified on-chain.' }, { status: 409 });
    }
    const priceLamports = availability.priceLamports;
    if (!Number.isSafeInteger(priceLamports) || priceLamports <= 0) throw new Error('Verified SOL reference price is unavailable.');
    const mintInfo = await rpc(rpcUrl, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const decimals = mintInfo?.value?.data?.parsed?.info?.decimals;
    if (!TOKEN_PROGRAMS.has(mintInfo?.value?.owner) || !Number.isInteger(decimals) || decimals < 0 || decimals > 18) throw new Error('Official $HANDLE mint could not be verified.');

    // Jupiter supplies a reference conversion only. No user tokens are swapped or sent to Jupiter.
    const url = new URL('https://api.jup.ag/swap/v1/quote');
    url.searchParams.set('inputMint', WSOL);
    url.searchParams.set('outputMint', HANDLE_MINT);
    url.searchParams.set('amount', String(priceLamports));
    url.searchParams.set('slippageBps', '50');
    url.searchParams.set('restrictIntermediateTokens', 'true');
    const response = await fetch(url, { headers: { 'x-api-key': key }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Jupiter pricing is temporarily unavailable (${response.status}).`);
    const quote = await response.json();
    if (quote.inputMint !== WSOL || quote.outputMint !== HANDLE_MINT || quote.inAmount !== String(priceLamports) || quote.swapMode !== 'ExactIn' || !Array.isArray(quote.routePlan) || !quote.routePlan.length) throw new Error('Jupiter returned an invalid reference quote.');
    if (!Number.isFinite(Number(quote.priceImpactPct)) || Math.abs(Number(quote.priceImpactPct)) > 0.01) throw new Error('Price impact is too high to issue a payment quote.');
    const amount = BigInt(quote.outAmount);
    if (amount < 2n || amount > 18446744073709551615n) throw new Error('Jupiter returned an invalid token amount.');
    const burn = amount / 2n;
    const treasury = amount - burn;
    const preview = { handle, wallet, mint: HANDLE_MINT, decimals, solReferenceLamports: priceLamports, totalRaw: amount.toString(), burnRaw: burn.toString(), treasuryRaw: treasury.toString(), paymentAvailable: false };
    if (action === 'preview') return Response.json(preview);
    const signer = loadSigner();
    const expiresAt = Math.floor(Date.now() / 1000) + 90;
    // Fixed field order and explicit version for the future on-chain Ed25519 verification.
    const message = `solhandle:token-mint:v1|${PROGRAM_ID}|${wallet}|${handle}|${HANDLE_MINT}|${priceLamports}|${amount}|${expiresAt}`;
    const signature = nacl.sign.detached(new TextEncoder().encode(message), signer.secretKey);
    return Response.json({ ...preview, expiresAt, signer: signer.publicKey.toBase58(), message, signature: encodeBase64(signature) });
  } catch (error) {
    return Response.json({ error: error?.message || 'Could not issue $HANDLE reference quote.' }, { status: 503 });
  }
}