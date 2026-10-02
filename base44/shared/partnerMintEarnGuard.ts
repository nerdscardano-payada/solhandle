import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { PROGRAM_ID } from './solhandleProtocol.ts';
import { primaryMintEarnPolicy } from './partnerMintEarnPolicy.mjs';

export async function checkPrimaryMintEarn(input, rpcUrl) {
  const program = new PublicKey(PROGRAM_ID);
  return primaryMintEarnPolicy(input, {
    program: PROGRAM_ID,
    keyBytes: value => new PublicKey(value).toBytes(),
    addresses: handle => {
      const [asset] = PublicKey.findProgramAddressSync([new TextEncoder().encode('asset'), new TextEncoder().encode(handle)], program);
      const [receipt] = PublicKey.findProgramAddressSync([new TextEncoder().encode('partner_receipt'), asset.toBytes()], program);
      return { asset: asset.toBase58(), receipt: receipt.toBase58() };
    },
    transaction: signature => rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]),
    receipt: (address, slot) => rpc(rpcUrl, 'getAccountInfo', [address, { encoding: 'base64', commitment: 'confirmed', minContextSlot: slot }]),
  });
}