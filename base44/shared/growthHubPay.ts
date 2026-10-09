import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { transactionSigner } from './growthHubTransaction.ts';
const allowed = new Set(['11111111111111111111111111111111', 'ComputeBudget111111111111111111111111111111', 'L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95', 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo']);
export async function verifyGrowthPay(entities, tx, wallet, signature, quest) {
  const page = await entities.Payment.filter({ tx_signature: signature, sender_wallet: wallet, status: 'CONFIRMED' }, { limit: 2 });
  if (!page.items.length) throw new Error('Geen afgeronde SolHandle Pay-betaling voor jouw wallet gevonden. Rond de betaling eerst af via SolHandle Pay.');
  const payment = page.items[0];
  if (page.items.some(p => p.receiver_wallet !== payment.receiver_wallet || p.amount_lamports !== payment.amount_lamports || p.handle !== payment.handle)) throw new Error('Tegenstrijdige betaalbewijzen vereisen beheercontrole.');
  const instructions = tx.transaction.message.instructions, transfers = instructions.filter(ix => ix.programId === '11111111111111111111111111111111');
  const info = transfers[0]?.parsed?.info, minimum = Number(quest.min_amount_lamports);
  if (!Number.isSafeInteger(minimum) || minimum < 1) throw new Error('Het minimale betaalbedrag is niet geconfigureerd.');
  if (transfers.length !== 1 || instructions.some(ix => !allowed.has(ix.programId)) || transfers[0].parsed?.type !== 'transfer' || !transactionSigner(tx, wallet) || info?.source !== wallet || !Number.isSafeInteger(info?.lamports) || info.lamports < minimum || info.lamports !== payment.amount_lamports || info.destination !== payment.receiver_wallet || info.destination === wallet || !/^@[a-z0-9]{1,20}$/.test(payment.handle)) throw new Error('De on-chain betaling voldoet niet aan de questvoorwaarden: juiste afzender, ontvanger en minimumbedrag, zonder zelfbetaling.');
  if (!PublicKey.isOnCurve(new PublicKey(info.destination).toBytes())) throw new Error('De betaling ging niet naar een gewone wallet.');
  const reuse = await entities.GrowthHubXP.count({ source_id: `solana:mainnet-beta:${signature}:PAY`, quest_slug: { $ne: quest.slug } });
  if (reuse) throw new Error('Deze betaling is al voor een andere betaalquest gebruikt.');
  return { handle: payment.handle, recipient: info.destination, amount_lamports: info.lamports, program: '11111111111111111111111111111111' };
}