import { Transaction } from '@solana/web3.js';

export default async function signPayTransaction(transaction, wallet, publicKey, fallback) {
  const address = publicKey.toBase58();
  if (transaction.feePayer?.toBase58() !== address) throw new Error('The sender changed. Review this payment again.');
  const standardWallet = wallet?.adapter?.standard ? wallet.adapter.wallet : null;
  const feature = standardWallet?.features?.['solana:signTransaction'];
  if (!feature) return fallback(transaction);
  // Use the wallet's current authorized account and specify the payment's chain.
  // The generic adapter omits the chain when requesting a standalone signature.
  let account = standardWallet.accounts.find(item => item.address === address);
  if (!account) {
    await standardWallet.features['standard:connect'].connect();
    account = standardWallet.accounts.find(item => item.address === address);
  }
  if (!account || !account.features.includes('solana:signTransaction')) throw new Error('Authorize transaction signing for the selected account in your wallet, then review this payment again.');
  if (!account.chains.includes('solana:mainnet')) throw new Error('Select Solana Mainnet in your wallet to send this payment.');
  const [result] = await feature.signTransaction({
    account,
    chain: 'solana:mainnet',
    transaction: new Uint8Array(transaction.serialize({ requireAllSignatures: false, verifySignatures: false })),
  });
  return Transaction.from(result.signedTransaction);
}