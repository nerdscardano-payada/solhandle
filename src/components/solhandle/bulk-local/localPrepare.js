import { PublicKey, Transaction, ComputeBudgetProgram } from '@solana/web3.js';
import { localRpc, encode64, METADATA_URL } from '@/components/solhandle/bulk-local/localRpc';
import { localAvailability } from '@/components/solhandle/bulk-local/localAvailability';
import { localMintInstruction } from '@/components/solhandle/bulk-local/localCodec';
export async function prepareLocalBatch(items, wallet, genesis) {
  const payer = new PublicKey(wallet), current = await localAvailability(items.map(item => item.handle), genesis);
  for (let i = 0; i < items.length; i++) {
    if (!current.items[i].available) throw new Error(`@${items[i].handle}: ${current.items[i].status}`);
    if (current.items[i].priceLamports !== items[i].priceLamports) throw new Error(`@${items[i].handle}: price changed. Review the order again.`);
    const metadata = await fetch(`${METADATA_URL}/${items[i].handle}.json`, { signal: AbortSignal.timeout(5000) });
    if (!metadata.ok || (await metadata.json()).name !== `@${items[i].handle}`) throw new Error('Start the local metadata server before minting.');
  }
  const block = (await localRpc('getLatestBlockhash', [{ commitment: 'confirmed' }])).value;
  const transaction = new Transaction({ feePayer: payer, ...block }).add(ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }), ...await Promise.all(items.map(item => localMintInstruction(item, current.config, payer))));
  const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
  if (serialized.length > 1232) throw new Error('This batch exceeds the Solana transaction size limit.');
  const simulation = (await localRpc('simulateTransaction', [encode64(serialized), { encoding: 'base64', sigVerify: false, replaceRecentBlockhash: true, commitment: 'confirmed', accounts: { encoding: 'base64', addresses: [wallet] } }])).value;
  if (simulation.err) throw new Error(`Local preflight failed: ${JSON.stringify(simulation.err)}. ${simulation.logs?.slice(-4).join(' ') || ''}`);
  const [balance, feeResult] = await Promise.all([localRpc('getBalance', [wallet, { commitment: 'confirmed' }]), localRpc('getFeeForMessage', [encode64(transaction.serializeMessage()), { commitment: 'confirmed' }])]);
  if (feeResult.value == null || simulation.accounts?.[0]?.lamports == null) throw new Error('Could not estimate local transaction costs.');
  const subtotal = items.reduce((sum, item) => sum + item.priceLamports, 0);
  const estimatedDebit = Math.max(subtotal + feeResult.value, balance.value - simulation.accounts[0].lamports);
  if (balance.value < estimatedDebit + 10000) throw new Error('Insufficient test SOL. Use the local faucet first.');
  return { transaction, block, estimatedDebit, fee: feeResult.value, collection: current.config.collection.toBase58() };
}
export async function prepareLocalOrder(names, wallet) {
  const current = await localAvailability(names), batches = [];
  const unavailable = current.items.find(item => !item.available);
  if (unavailable) throw new Error(`@${unavailable.handle}: ${unavailable.status}. Remove it before checkout.`);
  for (let index = 0; index < current.items.length;) {
    let items = current.items.slice(index, index + 2), prepared;
    try { prepared = await prepareLocalBatch(items, wallet, current.genesis); }
    catch (error) { if (items.length === 1) throw error; items = items.slice(0, 1); prepared = await prepareLocalBatch(items, wallet, current.genesis); }
    batches.push({ items, status: 'ready', estimatedDebit: prepared.estimatedDebit, fee: prepared.fee, collection: prepared.collection }); index += items.length;
  }
  const estimatedDebit = batches.reduce((sum, batch) => sum + batch.estimatedDebit, 0), balance = (await localRpc('getBalance', [wallet])).value;
  if (balance < estimatedDebit + 10000) throw new Error('Insufficient test SOL for the complete order. Fund your local wallet and review again.');
  return { wallet, genesis: current.genesis, batches, estimatedDebit, createdAt: new Date().toISOString() };
}