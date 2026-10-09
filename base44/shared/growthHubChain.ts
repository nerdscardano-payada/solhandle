import { secrets } from 'base44:runtime';
import { finalizedTransaction, assertChainWindow } from './growthHubTransaction.ts';
import { verifyGrowthMint } from './growthHubMint.ts';
import { verifyGrowthTokenMint } from './growthHubTokenMint.ts';
import { verifyGrowthPay } from './growthHubPay.ts';
export async function verifyGrowthChain(entities, profile, quest, signature) {
  const url = secrets.get('SOLANA_RPC_URL');
  if (!url) throw new Error('On-chain verificatie is nog niet geconfigureerd.');
  const tx = await finalizedTransaction(url, signature, quest.handler);
  if (!tx) return { pending: true, message: 'Nog geen volledig finalized bewijs op Mainnet-beta. Controleer de handtekening in Explorer en probeer later dezelfde handtekening opnieuw; voer geen nieuwe betaling uit alleen om de verificatie te herhalen.' };
  assertChainWindow(tx, profile, quest);
  const common = { signature, network: 'mainnet-beta', slot: tx.slot, occurred_at: new Date(tx.blockTime * 1000).toISOString() };
  if (quest.handler === 'ON_CHAIN_PAY') return { evidence: { ...common, kind: 'PAY', ...await verifyGrowthPay(entities, tx, profile.wallet, signature, quest) } };
  const mint = await verifyGrowthMint(url, tx, profile.wallet, quest.handler === 'ON_CHAIN_TOKEN_MINT');
  const tokenPayment = mint.token ? await verifyGrowthTokenMint(url, tx, signature, profile.wallet, mint) : {};
  const { instruction, token, ...proof } = mint;
  return { evidence: { ...common, kind: 'MINT', ...proof, ...tokenPayment } };
}