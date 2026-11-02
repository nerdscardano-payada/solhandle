import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { PROGRAM_ID, SEEDS } from './solhandleProtocol.ts';
import { rpc } from './solanaRpc.ts';

export async function handleProfilePrimary(rpcUrl, profiles) {
  if (!profiles.length) return [];
  const program = new PublicKey(PROGRAM_ID);
  const addresses = profiles.map(profile => PublicKey.findProgramAddressSync([
    new TextEncoder().encode(SEEDS.primary), new PublicKey(profile.owner).toBytes()
  ], program)[0].toBase58());
  const [lookup] = await Promise.allSettled([
    rpc(rpcUrl, 'getMultipleAccounts', [addresses, { encoding: 'base64', commitment: 'confirmed' }])
  ]);
  return profiles.map((profile, index) => {
    let primaryActive = null;
    if (lookup.status === 'fulfilled' && Array.isArray(lookup.value?.value)) {
      const account = lookup.value.value[index];
      primaryActive = false;
      if (account?.owner === PROGRAM_ID && account.data?.[0]) {
        const bytes = Uint8Array.from(atob(account.data[0]), character => character.charCodeAt(0));
        if (bytes.length >= 12) {
          const length = new DataView(bytes.buffer).getUint32(8, true);
          if (length >= 1 && length <= 20 && bytes.length >= 44 + length) {
            const handle = new TextDecoder().decode(bytes.slice(12, 12 + length));
            const asset = new PublicKey(bytes.slice(12 + length, 44 + length)).toBase58();
            primaryActive = handle === profile.handle && asset === profile.assetAddress;
          }
        }
      }
    }
    return { ...profile, primaryActive };
  });
}