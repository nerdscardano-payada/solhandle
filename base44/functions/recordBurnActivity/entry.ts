import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const type = body.type;
    const signature = String(body.signature || '').trim();
    const solReported = Number(body.sol_reported);
    if (!['BUYBACK', 'BURN'].includes(type) || !/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(signature)) return Response.json({ error: 'Enter a valid activity type and transaction signature.' }, { status: 400 });
    if (type === 'BUYBACK' && (!Number.isFinite(solReported) || solReported <= 0)) return Response.json({ error: 'Enter the SOL spent on the buyback.' }, { status: 400 });
    let wallet;
    try { wallet = new PublicKey(String(body.wallet || '')).toBase58(); } catch { return Response.json({ error: 'Enter a valid wallet address.' }, { status: 400 }); }
    const settings = await base44.asServiceRole.entities.TokenLaunchSettings.list('-updated_date', 1);
    const mint = settings[0]?.token_mint_address;
    if (!mint) return Response.json({ error: 'Set the official $HANDLE mint in admin first.' }, { status: 400 });
    const existing = await base44.asServiceRole.entities.BurnActivity.filter({ signature, type }, '-created_date', 1);
    if (existing.length) return Response.json({ error: 'This transaction is already recorded for this activity.' }, { status: 409 });
    const tx = await rpc(secrets.get('SOLANA_RPC_URL'), 'getTransaction', [signature, { encoding: 'jsonParsed', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
    if (!tx || tx.meta?.err) return Response.json({ error: 'Transaction not found or not successful on Solana.' }, { status: 400 });
    const signer = tx.transaction?.message?.accountKeys?.some(key => (typeof key === 'object' ? key.pubkey === wallet && key.signer : false));
    if (!signer) return Response.json({ error: 'The wallet must have signed this transaction.' }, { status: 400 });
    const balances = (rows) => rows.filter(row => row.mint === mint && row.owner === wallet).reduce((sum, row) => sum + Number(row.uiTokenAmount?.uiAmountString || 0), 0);
    let amount;
    if (type === 'BUYBACK') {
      amount = balances(tx.meta?.postTokenBalances || []) - balances(tx.meta?.preTokenBalances || []);
      if (!Number.isFinite(amount) || amount <= 0) return Response.json({ error: 'No increase in $HANDLE balance for this wallet was found in the transaction.' }, { status: 400 });
    } else {
      const instructions = [...(tx.transaction.message.instructions || []), ...(tx.meta?.innerInstructions || []).flatMap(group => group.instructions || [])];
      const burns = instructions.filter(ix => ix.parsed && ['burn', 'burnChecked'].includes(ix.parsed.type) && ix.parsed.info?.mint === mint && ix.parsed.info?.authority === wallet);
      const pre = (tx.meta?.preTokenBalances || []).find(row => row.mint === mint && row.owner === wallet);
      const decimals = pre?.uiTokenAmount?.decimals;
      if (decimals == null) return Response.json({ error: 'No $HANDLE balance for this wallet was found before the burn.' }, { status: 400 });
      amount = burns.reduce((sum, ix) => sum + Number(ix.parsed.info.amount || ix.parsed.info.tokenAmount?.amount || 0) / 10 ** decimals, 0);
      if (!Number.isFinite(amount) || amount <= 0) return Response.json({ error: 'No $HANDLE burn by this wallet was found in the transaction.' }, { status: 400 });
    }
    const record = await base44.asServiceRole.entities.BurnActivity.create({ type, signature, wallet, token_mint: mint, token_amount: amount, ...(type === 'BUYBACK' ? { sol_reported: solReported } : {}), block_time: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : new Date().toISOString() });
    return Response.json({ record });
  } catch (error) { return Response.json({ error: error.message || 'Unable to record activity.' }, { status: 500 }); }
}