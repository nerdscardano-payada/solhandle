import { secrets } from 'base44:runtime';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from '../../shared/solanaRpc.ts';

// Public, read-only on-chain data; no wallet or account is required.
export default async function(req) {
  try {
    const { tokenMint } = await req.json();
    if (typeof tokenMint !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenMint)) {
      return Response.json({ error: 'Invalid token mint.' }, { status: 400 });
    }
    let mint;
    try { mint = new PublicKey(tokenMint).toBase58(); }
    catch { return Response.json({ error: 'Invalid token mint.' }, { status: 400 }); }
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (!rpcUrl) return Response.json({ error: 'Supply connection unavailable.' }, { status: 503 });
    const result = await rpc(rpcUrl, 'getTokenSupply', [mint, { commitment: 'confirmed' }]);
    const supply = Number(result?.value?.uiAmountString);
    if (result?.value?.uiAmountString == null || !Number.isFinite(supply)) {
      return Response.json({ error: 'Supply data unavailable.' }, { status: 502 });
    }
    return Response.json({ tokenMint: mint, supply, slot: result.context?.slot, measuredAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Unable to read current supply from Solana.' }, { status: 502 });
  }
}