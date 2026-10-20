export const walletStorageKey = 'solhandle-selected-wallet-v2';
let requestedWallet = null;

export function requestWalletConnection(name) {
  requestedWallet = name;
}

export function allowWalletReconnect(adapter) {
  if (requestedWallet === adapter.name) {
    requestedWallet = null;
    return true;
  }
  // Restore authorized accounts only. Legacy autoConnect() may open a prompt.
  if (adapter.name === 'Phantom') {
    const provider = window.phantom?.solana;
    return Boolean(provider?.isPhantom && !provider.isBackpack && provider.isConnected && provider.publicKey);
  }
  if (adapter.standard) return Boolean(adapter.wallet?.accounts?.length);
  return Boolean(adapter.connected);
}