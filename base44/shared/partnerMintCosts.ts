import { VersionedTransaction } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { pda, b64, unb64, fault } from './partnerMintCodec.ts';
export default async function partnerMintCosts(url, intent) {
  const tx = VersionedTransaction.deserialize(unb64(intent.unsigned_transaction)), asset = pda('asset', intent.handle);
  const addresses = [pda('handle', intent.handle).toBase58(), asset.toBase58(), pda('partner_receipt', asset.toBytes()).toBase58()];
  const [simulation, fee] = await Promise.all([
    rpc(url, 'simulateTransaction', [intent.unsigned_transaction, { encoding: 'base64', sigVerify: false, commitment: 'confirmed', accounts: { encoding: 'base64', addresses } }]),
    rpc(url, 'getFeeForMessage', [b64(tx.message.serialize()), { commitment: 'confirmed' }])
  ]);
  if (!simulation?.value || simulation.value.err || simulation.value.accounts?.length !== 3) fault('SIMULATION_FAILED', 422, 'Devnet simulation failed. Check funds and request a fresh quote; nothing broadcast.');
  let rent = 0n;
  for (const account of simulation.value.accounts) { if (!account || !Number.isSafeInteger(account.lamports) || account.lamports < 0) fault('COST_ESTIMATE_UNAVAILABLE', 503); rent += BigInt(account.lamports); }
  if (!Number.isSafeInteger(fee?.value) || fee.value < 0) fault('COST_ESTIMATE_UNAVAILABLE', 503);
  return { estimatedNetworkFeeLamports: String(fee.value), estimatedAccountCostsLamports: rent.toString(), estimatedTotalLamports: (BigInt(intent.quote.mintPriceLamports) + rent + BigInt(fee.value)).toString(), storageChargeLamports: '0', walletPriorityFeeCapLamports: '1000000', simulationUnitsConsumed: simulation.value.unitsConsumed, rentAndStorageIncludedInMintPrice: false };
}