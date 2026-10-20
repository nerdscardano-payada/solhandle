export default async function signConnectedMessage(session, message) {
  const adapter = session.wallet?.adapter;
  const address = session.publicKey?.toBase58();
  // Phantom must use its own provider, never the shared window.solana slot
  // which another installed wallet can replace.
  const provider = adapter?.name === 'Phantom' ? window.phantom?.solana : null;
  if (provider) {
    const matches = () => provider.isPhantom && !provider.isBackpack && provider.isConnected && provider.publicKey?.toBase58() === address;
    if (!matches()) throw new Error('Unlock and reconnect your selected Phantom account before continuing.');
    const result = await provider.signMessage(message);
    if (!matches()) throw new Error('Your Phantom account changed while signing. Please try again.');
    return result.signature;
  }
  // Wallet Standard/native adapters retain their selected wallet instance.
  // No discovery, auto-connect, or fallback to another installed wallet here.
  if (adapter?.name === 'Phantom' && !adapter.standard) {
    throw new Error('The selected Phantom wallet is unavailable. Reconnect Phantom before continuing.');
  }
  return session.signMessage(message);
}