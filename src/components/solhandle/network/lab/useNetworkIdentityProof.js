import { useState } from 'react';
import useIdentityAttempt from '@/components/solhandle/network/lab/useIdentityAttempt';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import signConnectedMessage from '@/lib/signConnectedMessage';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
export default function useNetworkIdentityProof(actorId) {
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58() || '';
  const attemptGuard = useIdentityAttempt({ actorId, address, adapter: wallet.wallet?.adapter, connected: wallet.connected });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const client = useQueryClient();
  const verify = async handle => {
    if (!address || !wallet.signMessage || busy) return;
    const attempt = attemptGuard.begin();
    if (!attempt) return;
    setBusy(true); setError('');
    try {
      const proof = await labClient({ action: 'identityChallenge', actorId, wallet: address, handle });
      attempt.assertCurrent();
      if (proof.wallet !== address || !Number.isFinite(Date.parse(proof.expiresAt)) || Date.parse(proof.expiresAt) <= Date.now()) throw new Error('This wallet proof is invalid or expired. Start a new verification.');
      const signature = await signConnectedMessage(wallet, new TextEncoder().encode(proof.message));
      attempt.assertCurrent();
      if (Date.parse(proof.expiresAt) <= Date.now()) throw new Error('This wallet proof expired while signing. Start a new verification.');
      await labClient({ action: 'identityVerify', actorId, challengeId: proof.challengeId, signature: btoa(Array.from(signature, byte => String.fromCharCode(byte)).join('')) });
      attempt.assertCurrent();
      await client.invalidateQueries({ queryKey: ['network-lab'] });
    } catch (err) { setError(attempt.current() ? labError(err) : 'Verification interrupted because your wallet or Network account changed. Start again.'); }
    finally { attempt.finish(); setBusy(false); }
  };
  return { wallet, address, verify, busy, error, canSign: Boolean(actorId && wallet.connected && address && wallet.signMessage) };
}