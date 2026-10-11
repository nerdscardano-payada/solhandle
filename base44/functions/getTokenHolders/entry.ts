import { secrets } from 'base44:runtime';
import { tokenHolderBalances } from '../../shared/tokenHolderBalances.ts';

const MINT = 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump';
let cached = null;
let checkedAt = 0;

// Public aggregate only: no individual holder addresses are returned.
export default async function(req) {
  try {
    const { tokenMint } = await req.json();
    if (tokenMint !== MINT) return Response.json({ error: 'Official $HANDLE mint required.' }, { status: 400 });
    if (cached && Date.now() - checkedAt < 60000) return Response.json(cached);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (!rpcUrl) return Response.json({ error: 'Holder connection unavailable.' }, { status: 503 });
    const { balances } = await tokenHolderBalances(rpcUrl, MINT);
    let holders = 0;
    for (const balance of balances.values()) if (balance > 0n) holders++;
    cached = { tokenMint: MINT, holders, measuredAt: new Date().toISOString() };
    checkedAt = Date.now();
    return Response.json(cached);
  } catch (error) {
    return Response.json({ error: error.message || 'Unable to read $HANDLE holders.' }, { status: 502 });
  }
}