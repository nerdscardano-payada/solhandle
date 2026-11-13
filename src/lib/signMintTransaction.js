import { Transaction, VersionedTransaction } from '@solana/web3.js';

export default async function signMintTransaction(transaction, wallet, publicKey, fallback) {
  const address = publicKey.toBase58();
  const versioned = transaction instanceof VersionedTransaction;
  const payer = versioned ? transaction.message.staticAccountKeys[0] : transaction.feePayer;
  if (payer?.toBase58() !== address) throw new Error('The mint wallet changed. Review this mint again.');
  const adapter = wallet?.adapter;
  const standard = adapter?.standard ? adapter.wallet : null;
  const feature = standard?.features?.['solana:signTransaction'];
  if (!feature) {
    if (!fallback) throw new Error('This wallet cannot sign Solana transactions.');
    return fallback(transaction);
  }
  const assertConnected = () => {
    if (!adapter.connected || adapter.publicKey?.toBase58() !== address) throw new Error('Your wallet connection changed. Reconnect the same wallet before minting.');
  };
  assertConnected();
  const account = standard.accounts.find(item => item.address === address);
  if (!account?.features.includes('solana:signTransaction')) throw new Error('Authorize transaction signing for this account in your wallet.');
  if (!account.chains.includes('solana:mainnet')) throw new Error('Select Solana Mainnet in your wallet before minting.');
  const bytes = versioned ? transaction.serialize() : transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
  const [result] = await feature.signTransaction({ account, chain: 'solana:mainnet', transaction: new Uint8Array(bytes) });
  assertConnected();
  return versioned ? VersionedTransaction.deserialize(result.signedTransaction) : Transaction.from(result.signedTransaction);
}