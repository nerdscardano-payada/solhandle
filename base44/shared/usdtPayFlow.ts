import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@6.0.0';
import { rpc } from './solanaRpc.ts';
import { normalizeHandle, resolveOnChain, reverseOnChain } from './solhandleResolver.ts';
import { TOKEN_PROGRAM_ID, payError, usdtAmount, usdtAccounts, usdtTransaction, validateUsdtSigned, verifyUsdtBalances, to64 } from './usdtPayTransaction.ts';
import getPayToken from './payAssets.ts';
import { resolveContactPayment } from './contactPayment.ts';
import { findPayLink, assertPayLink } from './payRequestRules.ts';
import { refreshPayLink, claimPayLink } from './payRequestLifecycle.ts';
import { matchTokenPayRequest } from './payRequestAmounts.ts';
import confirmedTokenPayment from './tokenPayConfirmation.ts';

async function prepareUsdt(rpcUrl, context, resolved) {
  const token = getPayToken(context.asset);
  if (!resolved?.safeForNativeSol) throw payError(`This @handle must resolve to an ordinary Solana wallet before it can receive ${token.asset}.`);
  context.recipient = resolved.address;
  const { source, destination } = usdtAccounts(context.sender, context.recipient, token.asset);
  const [accounts, latest, balance] = await Promise.all([
    rpc(rpcUrl, 'getMultipleAccounts', [[token.mint, source.toBase58(), destination.toBase58()], { encoding: 'jsonParsed', commitment: 'confirmed' }]),
    rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'confirmed' }]),
    rpc(rpcUrl, 'getBalance', [context.sender, { commitment: 'confirmed' }]),
  ]);
  const [mint, senderToken, recipientToken] = accounts.value;
  if (mint?.owner !== token.programId || mint.data?.parsed?.type !== 'mint' || mint.data.parsed.info.decimals !== token.decimals || !mint.data.parsed.info.isInitialized) throw payError(`Official Solana ${token.asset} mint verification failed.`, 503);
  if ((mint.data.parsed.info.extensions || []).some(extension => !['metadataPointer', 'tokenMetadata'].includes(extension.extension))) throw payError(`This ${token.asset} mint has unsupported token extensions. Payment blocked.`);
  const checkAccount = (account, owner) => {
    const info = account?.data?.parsed?.info;
    if (account?.owner !== token.programId || account.data?.parsed?.type !== 'account' || info?.mint !== token.mint || info.owner !== owner || info.state !== 'initialized' || info.tokenAmount?.decimals !== token.decimals) throw payError(`A ${token.asset} token account is invalid or frozen. Payment blocked.`);
    if ((info.extensions || []).some(extension => extension.extension !== 'immutableOwner')) throw payError(`This ${token.asset} account uses unsupported transfer restrictions. Payment blocked.`);
    return info.tokenAmount.amount;
  };
  if (!senderToken) throw payError(`No spendable ${token.asset} found in your wallet’s associated Solana ${token.asset} account.`, 422);
  const available = checkAccount(senderToken, context.sender);
  if (BigInt(available) < usdtAmount(context.amountRaw)) throw payError(`Insufficient ${token.asset} in your wallet’s associated token account.`, 422);
  if (recipientToken) checkAccount(recipientToken, context.recipient);
  context.lastValidBlockHeight = latest.value.lastValidBlockHeight;
  const tx = usdtTransaction(context, latest.value.blockhash, !recipientToken);
  const [fee, rent] = await Promise.all([
    rpc(rpcUrl, 'getFeeForMessage', [to64(tx.serializeMessage()), { commitment: 'confirmed' }]),
    recipientToken ? Promise.resolve(0) : rpc(rpcUrl, 'getMinimumBalanceForRentExemption', [token.accountSize, { commitment: 'confirmed' }]),
  ]);
  if (!Number.isSafeInteger(fee?.value) || fee.value < 0 || fee.value > 105000 || !Number.isSafeInteger(rent) || rent < 0) throw payError('SOL costs could not be verified. Try again.', 503);
  if (Number(balance.value) < fee.value + rent) throw payError('Insufficient SOL for the network fee and recipient token account deposit.', 422);
  return { savedContact: !!resolved.savedContact, handleChanged: !!resolved.handleChanged, asset: token.asset, mint: token.mint, decimals: token.decimals, amountRaw: context.amountRaw, displayHandle: resolved.handle, destinationAddress: context.recipient, destinationTokenAccount: destination.toBase58(), senderWallet: context.sender, availableRaw: available, solBalanceLamports: balance.value, networkFeeEstimate: fee.value, accountCreationLamports: rent, createsTokenAccount: !recipientToken, lastValidBlockHeight: context.lastValidBlockHeight, serializedTransaction: to64(tx.serialize({ requireAllSignatures: false, verifySignatures: false })) };
}
export async function handleUsdtPayment(base44, rpcUrl, body) {
  const token = getPayToken(body.asset);
  if (!['prepare', 'submit', 'recover'].includes(body.action)) throw payError(`Unsupported ${token.asset} payment action.`);
  if (body.requestId && body.contactId) throw payError('Choose either a saved contact or a payment link, not both.');
  if (body.mint != null && body.mint !== token.mint) throw payError(`Only official ${token.asset} on Solana is supported.`);
  const handle = normalizeHandle(body.handle);
  if (!/^[a-z0-9]{1,20}$/.test(handle)) throw payError('Enter a valid @handle (1–20 letters or numbers).');
  const context = { asset: token.asset, handle, sender: new PublicKey(String(body.senderWallet || '')).toBase58(), recipient: '', amountRaw: usdtAmount(body.amountRaw).toString(), lastValidBlockHeight: Number(body.lastValidBlockHeight) };
  let link = body.requestId != null ? await findPayLink(base44.asServiceRole, body.requestId) : null;
  if (link) context.requestId = link.id;
  matchTokenPayRequest(link, context);
  const recipient = async () => {
    const resolved = body.contactId ? await resolveContactPayment(base44.asServiceRole, rpcUrl, body, handle, context.sender) : await resolveOnChain(rpcUrl, handle);
    if (link && (!resolved?.safeForNativeSol || resolved.address !== link.recipient_wallet_at_creation)) throw payError('This @handle has changed ownership. Request a new payment link.', 409);
    return resolved;
  };
  if (body.action === 'prepare') {
    if (link) link = await refreshPayLink(base44, rpcUrl, link, false);
    assertPayLink(link, context.amountRaw, '', token.asset);
    return Response.json(await prepareUsdt(rpcUrl, context, await recipient()));
  }
  context.recipient = new PublicKey(String(body.recipientWallet || '')).toBase58();
  matchTokenPayRequest(link, context);
  if (!Number.isSafeInteger(context.lastValidBlockHeight) || context.lastValidBlockHeight < 1) throw payError('Missing transaction expiry. Review the payment again.');
  const signed = validateUsdtSigned(body.signedTransaction, context), signature = bs58.encode(signed.signature);
  if (body.signature && body.signature !== signature) throw payError('Payment signature does not match the signed transaction.', 403);
  const getDetails = () => rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'base64', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  let details = await getDetails();
  if (details) return Response.json(await confirmedTokenPayment(base44, rpcUrl, signature, context, details, link));
  if (body.action === 'submit') {
    try {
      if (link) link = await refreshPayLink(base44, rpcUrl, link, false);
      assertPayLink(link, context.amountRaw, signature, token.asset);
      const resolved = await recipient();
      if (!resolved?.safeForNativeSol || resolved.address !== context.recipient) throw payError('The recipient changed or is no longer safe. Review the payment before signing again.', 409);
      const fee = await rpc(rpcUrl, 'getFeeForMessage', [to64(signed.serializeMessage()), { commitment: 'confirmed' }]);
      if (!Number.isSafeInteger(fee?.value) || fee.value > 105000) throw payError('The transaction expired or its fee could not be verified. Review it again.', 409);
      if (link) await claimPayLink(base44.asServiceRole, link, signed, signature, context.sender, 0, context);
    } catch (error) { return Response.json({ notSubmitted: true, error: error.message }, { status: error.status || 503 }); }
    // Sending only the exact signed bytes is idempotent. An RPC timeout is not proof of failure.
    try { await rpc(rpcUrl, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed', maxRetries: 3 }]); }
    catch { return Response.json({ signature, pending: true, error: 'Submission could not be confirmed. Check this payment before signing another one.' }, { status: 202 }); }
  }
  for (let attempt = 0; attempt < 7; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    details = await getDetails();
    if (details) return Response.json(await confirmedTokenPayment(base44, rpcUrl, signature, context, details, link));
  }
  const [height, statuses] = await Promise.all([rpc(rpcUrl, 'getBlockHeight', [{ commitment: 'finalized' }]), rpc(rpcUrl, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }])]);
  const status = statuses.value[0];
  if (status?.err) return Response.json({ signature, failed: true, error: `Solana rejected this payment. No ${token.asset} was transferred; a network fee may have been charged.` });
  if (!status && height > context.lastValidBlockHeight) return Response.json({ signature, expired: true, error: 'The signed payment expired without confirmation. You can review the payment again.' });
  return Response.json({ signature, pending: true, error: `Still awaiting confirmation. Check this signature before signing a new ${token.asset} payment.` }, { status: 202 });
}