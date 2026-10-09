import bs58 from 'npm:bs58@5.0.0';
import { readTokenMint } from './tokenMintFlow.ts';
import { readConfirmedTokenMint } from './handleTokenProof.ts';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
import { transactionKeys } from './growthHubTransaction.ts';
export async function verifyGrowthTokenMint(url, tx, signature, wallet, mintProof) {
  const ix = mintProof.instruction, keys = transactionKeys(tx), fields = readTokenMint({ data: bs58.decode(ix.data) });
  const payerToken = keys[ix.accounts[11]], treasuryToken = keys[ix.accounts[12]], payerIndex = ix.accounts[11];
  const before = tx.meta.preTokenBalances?.find(row => row.accountIndex === payerIndex && row.mint === HANDLE_MINT);
  if (keys[ix.accounts[10]] !== HANDLE_MINT || before?.owner !== wallet || fields.handle !== mintProof.handle || !payerToken || !treasuryToken) throw new Error('De mint is niet met het officiële $HANDLE-token vanuit jouw wallet betaald.');
  const payment = await readConfirmedTokenMint(url, signature, { ...fields, wallet, payerToken, treasuryToken }, tx, 'finalized');
  if (!payment || payment.wallet !== wallet || payment.asset_address !== mintProof.asset_address || payment.token_mint !== HANDLE_MINT) throw new Error('De daadwerkelijke $HANDLE-betaling kon niet worden bewezen.');
  return { token_mint: payment.token_mint, amount_raw: payment.amount_raw, burned_raw: payment.burned_raw, treasury_raw: payment.treasury_raw };
}