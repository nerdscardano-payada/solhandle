import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import useIdentityAttempt from '@/components/solhandle/network/lab/useIdentityAttempt';
import labClient from '@/components/solhandle/network/lab/labClient';

export default function useSignedProfileSave(actorId, onSaved) {
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58() || '';
  const guard = useIdentityAttempt({ actorId, address, adapter: wallet.wallet?.adapter, connected: wallet.connected });
  const client = useQueryClient();
  return useMutation({ mutationFn: async payload => {
    if (!wallet.signMessage) throw new Error('Connect your verified wallet with message signing enabled.');
    const attempt = guard.begin();
    if (!attempt) throw new Error('Finish the current wallet request before trying again.');
    try {
      const proof = await labClient({ ...payload, action: 'profileWriteChallenge', actorId, wallet: address });
      attempt.assertCurrent();
      const valid = () => Number.isFinite(Date.parse(proof.expiresAt)) && Date.parse(proof.expiresAt) > Date.now();
      if (proof.wallet !== address || proof.accountId !== actorId || proof.purpose !== 'DEVELOPMENT_SAVE_PROFILE' || typeof proof.message !== 'string' || proof.message.length > 2048 || !valid()) throw new Error('The profile authorization is invalid or expired. Please try again.');
      const signature = await wallet.signMessage(new TextEncoder().encode(proof.message));
      attempt.assertCurrent();
      if (!valid()) throw new Error('The profile authorization expired. No changes were submitted. Please try again.');
      const result = await labClient({ ...payload, action: 'saveProfile', actorId, challengeId: proof.challengeId, signature: btoa(Array.from(signature, byte => String.fromCharCode(byte)).join('')) });
      attempt.assertCurrent();
      await client.invalidateQueries({ queryKey: ['network-lab'] });
      attempt.assertCurrent();
      if (onSaved) onSaved(result);
      return result;
    } finally { attempt.finish(); }
  }});
}