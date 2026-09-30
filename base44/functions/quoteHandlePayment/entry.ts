import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { Keypair, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@5.0.0';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
import solanaClock from '../../shared/solanaClock.ts';
import { verifyHandleMint } from '../../shared/handleTokenMintInfo.ts';
import { normalizeHandle } from '../../shared/handlePricing.ts';
import { PROGRAM_ID } from '../../shared/solhandleProtocol.ts';
import { HANDLE_MINT, HANDLE_PAYMENT_RELEASED, handlePaymentStatus, handleTokenBalance } from '../../shared/handlePaymentStatus.ts';
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
    if (action === 'status') return Response.json(await handlePaymentStatus(secrets.get('SOLANA_RPC_URL')));
    const adminTest = action === 'sign_test' || action === 'preview_test';
    if (adminTest) {
      const user = await createClientFromRequest(req).auth.me();
      if (user?.role !== 'admin') return Response.json({ error: 'Only administrators can use the mainnet payment test.' }, { status: 403 });
    }
    if (action !== 'preview' && action !== 'sign' && !adminTest) return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    if (action === 'sign' && !HANDLE_PAYMENT_RELEASED) return Response.json({ error: '$HANDLE payment signing is closed until deployment verification, accounting and wallet checks are complete.' }, { status: 409 });
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
    if (adminTest && priceLamports > 10_000_000) return Response.json({ error: 'The administrator test is limited to handles priced at 0.01 SOL or less.' }, { status: 422 });
    const mintInfo = await rpc(rpcUrl, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const { decimals } = verifyHandleMint(mintInfo?.value);
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
    const priceImpact = Number(quote.priceImpactPct);
    if (typeof quote.priceImpactPct !== 'string' || !quote.priceImpactPct.trim() || !Number.isFinite(priceImpact)) throw new Error('Jupiter returned an invalid price impact.');
    const priceImpactLimitPercent = 10;
    const quoteEligible = Math.abs(priceImpact) <= priceImpactLimitPercent / 100;
    const quoteWarning = !quoteEligible
      ? `Reference price impact is ${(Math.abs(priceImpact) * 100).toFixed(2)}%, above the ${priceImpactLimitPercent}% payment-quote limit. This amount is illustrative only and cannot be used to approve a payment.`
      : Math.abs(priceImpact) > 0.01
        ? `Reference price impact is ${(Math.abs(priceImpact) * 100).toFixed(2)}%. Review the token amount carefully; the maximum allowed impact is 10%.`
        : '';
    if ((action === 'sign' || action === 'sign_test') && !quoteEligible) throw new Error(`Price impact is too high to issue a payment quote (maximum ${priceImpactLimitPercent}%).`);
    const amount = BigInt(quote.outAmount);
    if (amount < 2n || amount > 18446744073709551615n) throw new Error('Jupiter returned an invalid token amount.');
    const burn = amount / 2n;
    const treasury = amount - burn;
    const walletBalanceRaw = await handleTokenBalance(rpcUrl, wallet, HANDLE_MINT, mintInfo.value.owner);
    const paymentStatus = await handlePaymentStatus(rpcUrl);
    const tokenAccounts = await rpc(rpcUrl, 'getTokenAccountsByOwner', [wallet, { mint: HANDLE_MINT }, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const singleAccountSufficient = tokenAccounts.value?.some(row => row.account.owner === mintInfo.value.owner && row.account.data.parsed.info.owner === wallet && row.account.data.parsed.info.state === 'initialized' && BigInt(row.account.data.parsed.info.tokenAmount.amount) >= amount) || false;
    const preview = { singleAccountSufficient, discountPercent: 0, handle, wallet, mint: HANDLE_MINT, decimals, solReferenceLamports: priceLamports, totalRaw: amount.toString(), burnRaw: burn.toString(), treasuryRaw: treasury.toString(), walletBalanceRaw, sufficientBalance: BigInt(walletBalanceRaw) >= amount, priceImpactPercent: Math.abs(priceImpact) * 100, priceImpactLimitPercent, quoteEligible, quoteWarning, paymentAvailable: paymentStatus.paymentAvailable };
    if (action === 'preview' || action === 'preview_test') return Response.json(preview);
    const status = await handlePaymentStatus(rpcUrl);
    const signer = loadSigner();
    if (!(adminTest ? status.enabledOnChain : status.paymentAvailable) || status.quoteSigner !== signer.publicKey.toBase58()) return Response.json({ error: 'On-chain token payments and the quote signer are not verified for activation.' }, { status: 409 });
    if (adminTest) verifyHandleMint(mintInfo.value);
    // The program enforces Clock::unix_timestamp <= expiry <= Clock::unix_timestamp + 90.
    // Use chain time, leaving 15 seconds of headroom for RPC node clock differences.
    const expiresAt = await solanaClock(rpcUrl) + 75;
    // Fixed field order and explicit version for the future on-chain Ed25519 verification.
    const message = `solhandle:token-mint:v1|${PROGRAM_ID}|${wallet}|${handle}|${HANDLE_MINT}|${priceLamports}|${amount}|${expiresAt}`;
    const signature = nacl.sign.detached(new TextEncoder().encode(message), signer.secretKey);
    return Response.json({ ...preview, expiresAt, signer: signer.publicKey.toBase58(), message, signature: encodeBase64(signature) });
  } catch (error) {
    return Response.json({ error: error?.message || 'Could not issue $HANDLE reference quote.' }, { status: 503 });
  }
}