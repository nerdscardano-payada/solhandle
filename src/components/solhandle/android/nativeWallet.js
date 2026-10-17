import { PublicKey } from '@solana/web3.js';
import nativeTransport, { toBase64, fromBase64 } from '@/components/solhandle/android/nativeTransport';
const chain = 'solana:mainnet';
const features = ['solana:signTransaction', 'solana:signMessage'];
export default function createNativeWallet() {
  let accounts = [];
  const listeners = new Set();
  const changed = () => listeners.forEach(listener => listener({ accounts }));
  const check = input => {
    if (!accounts.some(account => account.address === input.account?.address)) throw new Error('Connect the selected account again.');
    if (input.chain && input.chain !== chain) throw new Error('SolHandle Android uses Solana Mainnet.');
  };
  const sign = async (method, inputs) => {
    const results = [];
    for (const input of inputs) {
      check(input);
      const payload = method === 'signTransaction' ? input.transaction : input.message;
      if (!payload?.length || payload.length > (method === 'signTransaction' ? 1232 : 4096)) throw new Error('The wallet payload is too large or empty.');
      const result = await nativeTransport(method, { payload: toBase64(payload), publicKey: toBase64(input.account.publicKey) });
      results.push(method === 'signTransaction' ? { signedTransaction: fromBase64(result.signedTransaction) } : { signedMessage: fromBase64(result.signedMessage), signature: fromBase64(result.signature), signatureType: 'ed25519' });
    }
    return results;
  };
  return {
    version: '1.0.0', name: 'SolHandle Android Wallet', chains: [chain],
    icon: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050914"/><text x="32" y="45" text-anchor="middle" fill="#5ce2fa" font-size="44">@</text></svg>'),
    get accounts() { return accounts; },
    features: {
      'standard:connect': { version: '1.0.0', connect: async ({ silent } = {}) => {
        if (!silent) {
          const result = await nativeTransport('connect');
          accounts = result.accounts.map(item => ({ address: new PublicKey(fromBase64(item.publicKey)).toBase58(), publicKey: fromBase64(item.publicKey), label: item.label, chains: [chain], features }));
          changed();
        }
        return { accounts };
      } },
      'standard:disconnect': { version: '1.0.0', disconnect: async () => { accounts = []; changed(); await nativeTransport('disconnect'); } },
      'standard:events': { version: '1.0.0', on: (event, listener) => { if (event === 'change') listeners.add(listener); return () => listeners.delete(listener); } },
      'solana:signTransaction': { version: '1.0.0', supportedTransactionVersions: ['legacy', 0], signTransaction: (...inputs) => sign('signTransaction', inputs) },
      'solana:signMessage': { version: '1.0.0', signMessage: (...inputs) => sign('signMessage', inputs) },
    },
  };
}