import bs58 from 'npm:bs58@5.0.0';
import { rpc } from './solanaRpc.ts';
import { requireWeekendMainnet as requireMainnet } from './weekendMainnet.ts';
export const chainHandlers = ['ON_CHAIN_MINT', 'ON_CHAIN_TOKEN_MINT', 'ON_CHAIN_PAY'];
export function transactionKeys(tx) { return [...tx.transaction.message.accountKeys.map(k => typeof k === 'string' ? k : k.pubkey), ...(tx.meta.loadedAddresses?.writable || []), ...(tx.meta.loadedAddresses?.readonly || [])]; }
export function transactionSigner(tx, wallet) {
  const keys = tx.transaction.message.accountKeys;
  return keys.some((key, index) => typeof key === 'string' ? key === wallet && index < tx.transaction.message.header.numRequiredSignatures : key.pubkey === wallet && key.signer === true);
}
export function assertChainWindow(tx, profile, quest) {
  const values = [profile.joined_at, quest.starts_at || quest.created_date].map(value => Date.parse(value));
  if (values.some(value => !Number.isFinite(value))) throw new Error('Het verificatievenster ontbreekt. Neem contact op met beheer.');
  if (!Number.isSafeInteger(tx.blockTime) || tx.blockTime <= 0 || tx.blockTime > Math.floor(Date.now() / 1000) + 30) throw new Error('De on-chain transactietijd ontbreekt of is ongeldig.');
  if (quest.ends_at && !Number.isFinite(Date.parse(quest.ends_at))) throw new Error('De eindtijd van de quest is ongeldig. Neem contact op met beheer.');
  const start = quest.retroactive_allowed ? values[1] : Math.max(...values);
  if (tx.blockTime < Math.ceil(start / 1000) || (quest.ends_at && tx.blockTime * 1000 >= Date.parse(quest.ends_at))) throw new Error('Deze transactie valt buiten het questvenster; zonder retroactieve toestemming tellen alleen nieuwe acties na je aanmelding.');
}
export async function finalizedTransaction(url, signature, handler) {
  if (typeof signature !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(signature) || bs58.decode(signature).length !== 64) throw new Error('Plak de volledige Solana-transactiehandtekening, niet het walletadres of een link.');
  await requireMainnet(url);
  const [statuses, tx] = await Promise.all([
    rpc(url, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }]),
    rpc(url, 'getTransaction', [signature, { encoding: handler === 'ON_CHAIN_PAY' ? 'jsonParsed' : 'json', commitment: 'finalized', maxSupportedTransactionVersion: 0 }])
  ]);
  const status = statuses?.value?.[0];
  if (status?.err || tx?.meta?.err) throw new Error('Deze transactie is mislukt en levert geen XP op.');
  if (!tx || !status || status.confirmationStatus !== 'finalized') return null;
  if (tx.meta?.err !== null || tx.transaction?.signatures?.[0] !== signature || !Number.isSafeInteger(tx.slot) || tx.slot < 1) throw new Error('Het RPC-bewijs is onvolledig of hoort niet bij deze transactie.');
  return tx;
}