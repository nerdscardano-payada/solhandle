import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { PublicKey, Transaction } from 'npm:@solana/web3.js@1.98.4';
import { secrets, waitUntil } from 'base44:runtime';
import bs58 from 'npm:bs58@5.0.0';
import { rpc, getProtocolConfig } from '../../shared/solanaRpc.ts';
import solanaClock from '../../shared/solanaClock.ts';
import { HANDLE_MINT, handlePaymentStatus } from '../../shared/handlePaymentStatus.ts';
import { verifyHandleMint } from '../../shared/handleTokenMintInfo.ts';
import { mintInstructions, fromBase64, pda } from '../../shared/handleTokenTransactions.ts';
import { previewTokenTransaction, validateSignedTokenMint } from '../../shared/tokenMintFlow.ts';
import indexTokenMint from '../../shared/indexTokenMint.ts';
import { activeTokenLookup, lookupAddresses } from '../../shared/tokenPaymentLookup.ts';
import decodeTokenTransaction from '../../shared/decodeTokenTransaction.ts';
async function confirmation(base44, rpcUrl, signature, blockhash = null) {
  const status = (await rpc(rpcUrl, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }])).value?.[0];
  if (status?.err) return { signature, status: 'failed', error: `Transaction failed: ${JSON.stringify(status.err)}` };
  if (!status && blockhash && !(await rpc(rpcUrl, 'isBlockhashValid', [blockhash, { commitment: 'finalized' }])).value) {
    const found = await rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
    if (!found) return { signature, status: 'expired', error: 'This transaction expired without a recorded confirmation. Review a fresh quote.' };
    if (found.meta?.err) return { signature, status: 'failed', error: `Transaction failed: ${JSON.stringify(found.meta.err)}` };
    const payment = await indexTokenMint(base44, rpcUrl, signature, found);
    waitUntil(base44.functions.invoke('syncSolHandleIndex', { signature }));
    return { signature, status: 'confirmed', payment, asset: payment.asset_address };
  }
  if (!['confirmed', 'finalized'].includes(status?.confirmationStatus)) return { signature, status: 'pending' };
  const transaction = await rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  if (!transaction) return { signature, status: 'pending' };
  const payment = await indexTokenMint(base44, rpcUrl, signature, transaction);
  waitUntil(base44.functions.invoke('syncSolHandleIndex', { signature }));
  return { signature, status: 'confirmed', payment, asset: payment.asset_address };
}
export default async function(req: Request): Promise<Response> {
  let submittedSignature = '';
  try {
    const body = await req.json(), base44 = createClientFromRequest(req), rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (!['status', 'prepare', 'submit', 'confirm'].includes(body.action)) return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    if (await rpc(rpcUrl, 'getGenesisHash') !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('$HANDLE minting requires Solana mainnet.');
    if (body.action === 'confirm') {
      if (!/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(body.signature || '')) throw new Error('Invalid transaction signature.');
      if (body.blockhash && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(body.blockhash)) throw new Error('Invalid transaction blockhash.');
      return Response.json(await confirmation(base44, rpcUrl, body.signature, body.blockhash));
    }
    const payment = await handlePaymentStatus(rpcUrl);
    if (body.action === 'status') return Response.json({ ...payment, priceImpactLimitPercent: 10, discountPercent: 0, network: 'mainnet-beta' });
    if (!payment.paymentAvailable) return Response.json({ error: payment.reason || '$HANDLE payments are unavailable.' }, { status: 409 });
    const protocol = await getProtocolConfig(rpcUrl);
    const mintAccount = await rpc(rpcUrl, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const tokenProgram = new PublicKey(verifyHandleMint(mintAccount.value).tokenProgram);
    const lookupTable = await activeTokenLookup(base44, rpcUrl, lookupAddresses(protocol, payment, tokenProgram));
    if (body.action === 'prepare') {
      const wallet = new PublicKey(body.wallet), handle = String(body.handle || '').trim().replace(/^@/, '').toLowerCase();
      if (!/^[a-z0-9]{1,20}$/.test(handle) || typeof body.uri !== 'string' || !/^https:\/\//.test(body.uri) || new TextEncoder().encode(body.uri).length > 200) throw new Error('Valid handle and NFT metadata are required.');
      if (!/^\d{1,20}$/.test(body.max_amount_raw || '') || !Number.isSafeInteger(body.sol_reference_lamports)) throw new Error('Review a valid quote before approval.');
      const quote = (await base44.functions.invoke('quoteHandlePayment', { action: 'sign', handle, wallet: wallet.toBase58() })).data;
      if (!quote.quoteEligible || !quote.sufficientBalance || !quote.singleAccountSufficient) throw new Error('One spendable $HANDLE account must cover the full payment.');
      if (quote.solReferenceLamports !== body.sol_reference_lamports || BigInt(quote.totalRaw) > BigInt(body.max_amount_raw)) throw new Error('Pricing increased. Refresh and review a new quote before approving.');
      const accounts = await rpc(rpcUrl, 'getTokenAccountsByOwner', [wallet.toBase58(), { mint: HANDLE_MINT }, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
      const account = accounts.value?.find(row => row.account.owner === tokenProgram.toBase58() && row.account.data.parsed.info.owner === wallet.toBase58() && row.account.data.parsed.info.state === 'initialized' && BigInt(row.account.data.parsed.info.tokenAmount.amount) >= BigInt(quote.totalRaw));
      if (!account) throw new Error('Consolidate your $HANDLE into one spendable account first.');
      const instructions = await mintInstructions(wallet, handle, body.uri, quote, protocol, payment, account.pubkey, tokenProgram);
      const transaction_base64 = await previewTokenTransaction(rpcUrl, wallet, instructions, lookupTable);
      return Response.json({ transaction_base64, transaction_version: lookupTable ? 0 : 'legacy', transaction_bytes: fromBase64(transaction_base64).length, lookup_table: lookupTable?.key.toBase58() || null, quote, asset: pda('asset', handle).toBase58(), network: 'mainnet-beta' });
    }
    if (typeof body.transaction_base64 !== 'string' || body.transaction_base64.length > 1700) throw new Error('Invalid signed transaction.');
    const tx = decodeTokenTransaction(fromBase64(body.transaction_base64), lookupTable);
    const expected = await validateSignedTokenMint(tx, protocol, payment, tokenProgram);
    const now = await solanaClock(rpcUrl);
    if (expected.expiresAt <= now || expected.expiresAt > now + 90) throw new Error('Payment quote expired before submission. Review a fresh quote; nothing was submitted.');
    const minContextSlot = await rpc(rpcUrl, 'getSlot', [{ commitment: 'finalized' }]);
    if (!(await rpc(rpcUrl, 'isBlockhashValid', [tx.recentBlockhash, { commitment: 'confirmed', minContextSlot }])).value) throw new Error('Transaction expired before submission. Review a fresh transaction; nothing was submitted.');
    // Preserve the wallet signature even when the RPC response is lost after broadcasting.
    submittedSignature = bs58.encode(tx.signature);
    const signature = await rpc(rpcUrl, 'sendTransaction', [body.transaction_base64, { encoding: 'base64', preflightCommitment: 'confirmed', minContextSlot }]);
    submittedSignature = signature;
    waitUntil((async () => {
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const receipt = await confirmation(base44, rpcUrl, signature);
        if (receipt.status !== 'pending') return;
      }
    })());
    return Response.json({ signature, status: 'pending' });
  } catch (error) {
    if (submittedSignature) return Response.json({ signature: submittedSignature, status: 'pending', error: `Submission may have reached Solana. Check this transaction before retrying. ${error.message}` });
    return Response.json({ error: error.message || 'Token mint failed before submission.' }, { status: 400 });
  }
}