import { useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import signConnectedMessage from '@/lib/signConnectedMessage';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
export default function useNetworkIdentityProof(actorId) {
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58() || '';
  const current = useRef(address); current.current = address;
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const client = useQueryClient();
  const verify = async handle => {
    if (!address || !wallet.signMessage || busy) return;
    setBusy(true); setError('');
    try {
      const proof = await labClient({ action: 'identityChallenge', actorId, wallet: address, handle });
      if (current.current !== address) throw new Error('Your wallet changed. Select the intended account and try again.');
      const signature = await signConnectedMessage(wallet, new TextEncoder().encode(proof.message));
      if (current.current !== address) throw new Error('Your wallet changed while signing. Please try again.');
      await labClient({ action: 'identityVerify', actorId, challengeId: proof.challengeId, signature: btoa(Array.from(signature, byte => String.fromCharCode(byte)).join('')) });
      await client.invalidateQueries({ queryKey: ['network-lab'] });
    } catch (err) { setError(labError(err)); } finally { setBusy(false); }
  };
  return { wallet, address, verify, busy, error, canSign: Boolean(address && wallet.signMessage) };
}