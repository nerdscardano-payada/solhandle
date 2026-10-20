import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// A distinct internal ID prevents Wallet Standard discovery replacing this adapter.
export const pinnedPhantomName = 'SolHandle:Phantom';
export default class PinnedPhantomAdapter extends PhantomWalletAdapter {
  constructor() {
    super();
    this.name = pinnedPhantomName;
  }
  get readyState() {
    const provider = typeof window !== 'undefined' && window.phantom?.solana;
    return provider?.isPhantom && !provider.isBackpack ? 'Installed' : super.readyState;
  }
  async connect() {
    const provider = window.phantom?.solana;
    // Never let the legacy adapter fall back to the shared window.solana slot.
    if (!provider?.isPhantom || provider.isBackpack) {
      throw new Error('Phantom is unavailable. Open SolHandle in Phantom or enable the Phantom extension.');
    }
    await super.connect();
    if (this._wallet && this._wallet !== provider) {
      throw new Error('The Phantom provider changed. Reconnect Phantom before continuing.');
    }
  }
}