import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@6.0.0';
import { rpc } from './solanaRpc.ts';
import { normalizeHandle, resolveOnChain, reverseOnChain } from './solhandleResolver.ts';
import { USDT_MINT, USDT_DECIMALS, TOKEN_PROGRAM_ID, payError, usdtAmount, usdtAccounts, usdtTransaction, validateUsdtSigned, verifyUsdtBalances, to64 } from './usdtPayTransaction.ts';

async function prepareUsdt(rpcUrl, context) {
  const resolved = await resolveOnChain(rpcUrl, context.handle);
  if (!resolved?.safeForNativeSol) throw payError('This @handle must resolve to an ordinary Solana wallet before it can receive USDT.');
  context.recipient = resolved.address;
  const { source, destination } = usdtAccounts(context.sender, context.recipient);
  const [accounts, latest, balance] = await Promise.all([
    rpc(rpcUrl, 'getMultipleAccounts', [[USDT_MINT, source.toBase58(), destination.toBase58()], { encoding: 'jsonParsed', commitment: 'confirmed' }]),
    rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'confirmed' }]),
    rpc(rpcUrl, 'getBalance', [context.sender, { commitment: 'confirmed' }]),
  ]);
  const [mint, senderToken, recipientToken] = accounts.value;
  if (mint?.owner !== TOKEN_PROGRAM_ID.toBase58() || mint.data?.parsed?.type !== 'mint' || mint.data.parsed.info.decimals !== USDT_DECIMALS || !mint.data.parsed.info.isInitialized) throw payError('Official Solana USDT mint verification failed.', 503);
  const checkAccount = (account, owner) => {
    const info = account?.data?.parsed?.info;
    if (account?.owner !== TOKEN_PROGRAM_ID.toBase58() || account.data?.parsed?.type !== 'account' || info?.mint !== USDT_MINT || info.owner !== owner || info.state !== 'initialized' || info.tokenAmount?.decimals !== USDT_DECIMALS) throw payError('A USDT token account is invalid or frozen. Payment blocked.');
    return info.tokenAmount.amount;
  };
  if (!senderToken) throw payError('No spendable USDT found in your wallet’s associated Solana USDT account.', 422);
  const available = checkAccount(senderToken, context.sender);
  if (BigInt(available) < usdtAmount(context.amountRaw)) throw payError('Insufficient USDT in your wallet’s associated token account.', 422);
  if (recipientToken) checkAccount(recipientToken, context.recipient);
  context.lastValidBlockHeight = latest.value.lastValidBlockHeight;
  const tx = usdtTransaction(context, latest.value.blockhash, !recipientToken);
  const [fee, rent] = await Promise.all([
    rpc(rpcUrl, 'getFeeForMessage', [to64(tx.serializeMessage()), { commitment: 'confirmed' }]),
    recipientToken ? Promise.resolve(0) : rpc(rpcUrl, 'getMinimumBalanceForRentExemption', [165, { commitment: 'confirmed' }]),
  ]);
  if (!Number.isSafeInteger(fee?.value) || fee.value < 0 || fee.value > 105000 || !Number.isSafeInteger(rent) || rent < 0) throw payError('SOL costs could not be verified. Try again.', 503);
  if (Number(balance.value) < fee.value + rent) throw payError('Insufficient SOL for the network fee and recipient token account deposit.', 422);
  return { asset: 'USDT', mint: USDT_MINT, decimals: USDT_DECIMALS, amountRaw: context.amountRaw, displayHandle: resolved.handle, destinationAddress: context.recipient, destinationTokenAccount: destination.toBase58(), senderWallet: context.sender, availableRaw: available, solBalanceLamports: balance.value, networkFeeEstimate: fee.value, accountCreationLamports: rent, createsTokenAccount: !recipientToken, lastValidBlockHeight: context.lastValidBlockHeight, serializedTransaction: to64(tx.serialize({ requireAllSignatures: false, verifySignatures: false })) };
}
async function confirmedUsdt(base44, rpcUrl, signature, context, details) {
  if (details.meta?.err) return { signature, failed: true, error: 'Solana rejected this USDT payment. No USDT was transferred; a network fee may have been charged.' };
  const chainTx = validateUsdtSigned(details.transaction[0], context);
  if (bs58.encode(chainTx.signature) !== signature) throw payError('On-chain signature mismatch.', 403);
  verifyUsdtBalances(details, context);
  const existing = await base44.asServiceRole.entities.Payment.filter({ tx_signature: signature }, { limit: 1 });
  if (existing.items[0]) {
    const payment = existing.items[0];
    if (payment.asset !== 'USDT' || payment.token_mint !== USDT_MINT || payment.amount_raw !== context.amountRaw || payment.sender_wallet !== context.sender || payment.receiver_wallet !== context.recipient || payment.handle !== `@${context.handle}`) throw payError('This signature is already recorded for a different payment.', 409);
    return { signature, payment };
  }
  let primary = '';
  try { primary = (await reverseOnChain(rpcUrl, context.sender))?.primaryHandle || ''; } catch { /* Optional display only. */ }
  const time = details.blockTime ? new Date(details.blockTime * 1000).toISOString() : new Date().toISOString();
  const saved = await base44.asServiceRole.entities.Payment.upsert([{ handle: `@${context.handle}`, receiver_wallet: context.recipient, sender_wallet: context.sender, sender_primary_handle: primary, asset: 'USDT', token_mint: USDT_MINT, token_decimals: USDT_DECIMALS, amount_raw: context.amountRaw, tx_signature: signature, status: 'CONFIRMED', created_at: time, confirmed_at: time }], { key: 'tx_signature' });
  return { signature, payment: saved.records[0] };
}
export async function handleUsdtPayment(base44, rpcUrl, body) {
  if (!['prepare', 'submit', 'recover'].includes(body.action)) throw payError('Unsupported USDT payment action.');
  if (body.requestId || body.contactId) throw payError('USDT currently supports direct @handle payments only. Payment requests remain SOL-only.');
  if (body.mint != null && body.mint !== USDT_MINT) throw payError('Only official USDT on Solana is supported.');
  const handle = normalizeHandle(body.handle);
  if (!/^[a-z0-9]{1,20}$/.test(handle)) throw payError('Enter a valid @handle (1–20 letters or numbers).');
  const context = { handle, sender: new PublicKey(String(body.senderWallet || '')).toBase58(), recipient: '', amountRaw: usdtAmount(body.amountRaw).toString(), lastValidBlockHeight: Number(body.lastValidBlockHeight) };
  if (body.action === 'prepare') return Response.json(await prepareUsdt(rpcUrl, context));
  context.recipient = new PublicKey(String(body.recipientWallet || '')).toBase58();
  if (!Number.isSafeInteger(context.lastValidBlockHeight) || context.lastValidBlockHeight < 1) throw payError('Missing transaction expiry. Review the payment again.');
  const signed = validateUsdtSigned(body.signedTransaction, context), signature = bs58.encode(signed.signature);
  if (body.signature && body.signature !== signature) throw payError('Payment signature does not match the signed transaction.', 403);
  const getDetails = () => rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'base64', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  let details = await getDetails();
  if (details) return Response.json(await confirmedUsdt(base44, rpcUrl, signature, context, details));
  if (body.action === 'submit') {
    const resolved = await resolveOnChain(rpcUrl, handle);
    if (!resolved?.safeForNativeSol || resolved.address !== context.recipient) return Response.json({ notSubmitted: true, error: 'The @handle owner changed. Review the new recipient before signing again.' }, { status: 409 });
    const fee = await rpc(rpcUrl, 'getFeeForMessage', [to64(signed.serializeMessage()), { commitment: 'confirmed' }]);
    if (!Number.isSafeInteger(fee?.value) || fee.value > 105000) return Response.json({ notSubmitted: true, error: 'The transaction expired or its fee could not be verified. Review it again.' }, { status: 409 });
    // Sending only the exact signed bytes is idempotent. An RPC timeout is not proof of failure.
    try { await rpc(rpcUrl, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed', maxRetries: 3 }]); }
    catch { return Response.json({ signature, pending: true, error: 'Submission could not be confirmed. Check this payment before signing another one.' }, { status: 202 }); }
  }
  for (let attempt = 0; attempt < 7; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    details = await getDetails();
    if (details) return Response.json(await confirmedUsdt(base44, rpcUrl, signature, context, details));
  }
  const [height, statuses] = await Promise.all([rpc(rpcUrl, 'getBlockHeight', [{ commitment: 'finalized' }]), rpc(rpcUrl, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }])]);
  const status = statuses.value[0];
  if (status?.err) return Response.json({ signature, failed: true, error: 'Solana rejected this payment. No USDT was transferred; a network fee may have been charged.' });
  if (!status && height > context.lastValidBlockHeight) return Response.json({ signature, expired: true, error: 'The signed payment expired without confirmation. You can review the payment again.' });
  return Response.json({ signature, pending: true, error: 'Still awaiting confirmation. Check this signature before signing a new USDT payment.' }, { status: 202 });
}