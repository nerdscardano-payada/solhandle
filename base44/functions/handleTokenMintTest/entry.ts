import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { PublicKey, Transaction, ComputeBudgetProgram } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import { secrets } from 'base44:runtime';
import { rpc, getProtocolConfig } from '../../shared/solanaRpc.ts';
import solanaClock from '../../shared/solanaClock.ts';
import { HANDLE_MINT, handlePaymentStatus } from '../../shared/handlePaymentStatus.ts';
import { verifyHandleMint } from '../../shared/handleTokenMintInfo.ts';
import { configurationInstructions, mintInstructions, sameInstruction, program, fromBase64, toBase64 } from '../../shared/handleTokenTransactions.ts';
import { confirmTokenMint } from '../../shared/handleTokenProof.ts';
import validateTokenConfiguration from '../../shared/validateTokenConfiguration.ts';
import tokenConfigurationValidationChecks from '../../shared/tokenConfigurationValidationChecks.ts';
import { previewTokenTransaction as previewTransaction, validateSignedTokenMint } from '../../shared/tokenMintFlow.ts';
import { activeTokenLookup, lookupAddresses } from '../../shared/tokenPaymentLookup.ts';
import decodeTokenTransaction from '../../shared/decodeTokenTransaction.ts';
const encoder = new TextEncoder();
async function signerKey(base44) { return (await base44.functions.invoke('quoteHandlePayment', { action: 'signer' })).data.publicKey; }
async function validateMint(base44, tx, protocol, payment, tokenProgram) {
  if (!payment.enabledOnChain || payment.quoteSigner !== await signerKey(base44)) throw new Error('The on-chain payment configuration is not ready.');
  return validateSignedTokenMint(tx, protocol, payment, tokenProgram, 10000000);
}
export default async function(req: Request): Promise<Response> {
  let submittedSignature = '';
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Administrator access is required.' }, { status: 403 });
    const body = await req.json(), rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (await rpc(rpcUrl, 'getGenesisHash') !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('This small-payment test is explicitly for Solana mainnet.');
    const protocol = await getProtocolConfig(rpcUrl);
    const payment = await handlePaymentStatus(rpcUrl);
    if (body.action === 'status') return Response.json({ ...payment, authority: protocol.authority, treasury: protocol.treasury, network: 'mainnet-beta', maxSolReferenceLamports: 10000000 });
    const mintAccount = await rpc(rpcUrl, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const verifiedMint = verifyHandleMint(mintAccount.value);
    const tokenProgram = new PublicKey(verifiedMint.tokenProgram);
    const lookupTable = await activeTokenLookup(base44, rpcUrl, lookupAddresses(protocol, payment, tokenProgram));
    if (body.action === 'validate_configuration_rules') return Response.json(await tokenConfigurationValidationChecks(protocol.treasury, await signerKey(base44), tokenProgram));
    if (body.action === 'prepare_configuration') {
      const wallet = new PublicKey(body.wallet);
      if (wallet.toBase58() !== protocol.authority) throw new Error(`Connect the protocol authority wallet: ${protocol.authority}`);
      const instructions = await configurationInstructions(wallet, protocol.treasury, await signerKey(base44), tokenProgram);
      return Response.json({ transaction_base64: await previewTransaction(rpcUrl, wallet, instructions), network: 'mainnet-beta' });
    }
    if (body.action === 'prepare') {
      const wallet = new PublicKey(body.wallet);
      const handle = String(body.handle || '').trim().replace(/^@/, '').toLowerCase();
      if (!/^https:\/\//.test(body.uri || '') || encoder.encode(body.uri).length > 200) throw new Error('Valid NFT metadata is required.');
      const quote = (await base44.functions.invoke('quoteHandlePayment', { action: 'sign_test', handle, wallet: wallet.toBase58() })).data;
      if (!quote.sufficientBalance || !quote.quoteEligible) throw new Error('Insufficient token balance or ineligible quote.');
      if (quote.solReferenceLamports !== body.sol_reference_lamports || BigInt(quote.totalRaw) > BigInt(body.max_amount_raw || '0')) throw new Error('The quote increased. Review a new quote before approving.');
      const accounts = await rpc(rpcUrl, 'getTokenAccountsByOwner', [wallet.toBase58(), { mint: HANDLE_MINT }, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
      const account = accounts.value?.find(row => row.account.owner === tokenProgram.toBase58() && row.account.data.parsed.info.owner === wallet.toBase58() && row.account.data.parsed.info.state === 'initialized' && BigInt(row.account.data.parsed.info.tokenAmount.amount) >= BigInt(quote.totalRaw));
      if (!account) throw new Error('One spendable token account must cover the full payment; consolidate your $HANDLE balance first.');
      const instructions = await mintInstructions(wallet, handle, body.uri, quote, protocol, payment, account.pubkey, tokenProgram);
      const transaction_base64 = await previewTransaction(rpcUrl, wallet, instructions, lookupTable);
      return Response.json({ transaction_base64, transaction_version: lookupTable ? 0 : 'legacy', transaction_bytes: fromBase64(transaction_base64).length, quote, network: 'mainnet-beta' });
    }
    if (body.action === 'submit_configuration' || body.action === 'submit' || body.action === 'validate_configuration') {
      const raw = fromBase64(body.transaction_base64 || ''), tx = body.action === 'submit' ? decodeTokenTransaction(raw, lookupTable) : Transaction.from(raw);
      let expected;
      if (body.action === 'submit_configuration' || body.action === 'validate_configuration') {
        const authority = new PublicKey(protocol.authority);
        validateTokenConfiguration(tx, await configurationInstructions(authority, protocol.treasury, await signerKey(base44), tokenProgram), authority);
        if (body.action === 'validate_configuration') return Response.json({ valid: true, submitted: false });
      } else {
        expected = await validateMint(base44, tx, protocol, payment, tokenProgram);
        const now = await solanaClock(rpcUrl);
        if (expected.expiresAt <= now || expected.expiresAt > now + 90) throw new Error('The payment quote expired. Review a fresh quote.');
      }
      const minContextSlot = await rpc(rpcUrl, 'getSlot', [{ commitment: 'finalized' }]);
      const validity = await rpc(rpcUrl, 'isBlockhashValid', [tx.recentBlockhash, { commitment: 'confirmed', minContextSlot }]);
      if (!validity.value) throw new Error('The transaction expired while awaiting wallet approval. Prepare it again and approve the fresh transaction; this attempt was not submitted.');
      const signature = await rpc(rpcUrl, 'sendTransaction', [body.transaction_base64, { encoding: 'base64', preflightCommitment: 'confirmed', minContextSlot }]);
      submittedSignature = signature;
      for (let i = 0; i < 12; i++) {
        const result = await rpc(rpcUrl, 'getSignatureStatuses', [[signature], { searchTransactionHistory: true }]);
        const status = result.value?.[0];
        if (status?.err) return Response.json({ signature, status: 'failed', error: `Transaction failed: ${JSON.stringify(status.err)}` });
        if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
          const proof = expected ? await confirmTokenMint(base44, rpcUrl, signature, expected) : null;
          return Response.json({ signature, status: 'confirmed', payment: proof, configuration: expected ? null : await handlePaymentStatus(rpcUrl) });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return Response.json({ signature, status: 'pending' });
    }
    if (body.action === 'confirm') {
      if (!/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(body.signature || '')) throw new Error('Invalid transaction signature.');
      const found = await rpc(rpcUrl, 'getTransaction', [body.signature, { encoding: 'base64', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
      if (!found) return Response.json({ signature: body.signature, status: 'pending' });
      if (found.meta?.err) return Response.json({ signature: body.signature, status: 'failed', error: `Transaction failed: ${JSON.stringify(found.meta.err)}` });
      const tx = decodeTokenTransaction(fromBase64(found.transaction[0]), lookupTable);
      if (tx.instructions.some(ix => ix.programId.toBase58() === 'Ed25519SigVerify111111111111111111111111111')) {
        const expected = await validateMint(base44, tx, protocol, payment, tokenProgram);
        return Response.json({ signature: body.signature, status: 'confirmed', payment: await confirmTokenMint(base44, rpcUrl, body.signature, expected) });
      }
      validateTokenConfiguration(tx, await configurationInstructions(new PublicKey(protocol.authority), protocol.treasury, await signerKey(base44), tokenProgram), new PublicKey(protocol.authority));
      return Response.json({ signature: body.signature, status: 'confirmed', configuration: payment });
    }
    return Response.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch (error) {
    if (submittedSignature) return Response.json({ signature: submittedSignature, status: 'pending', error: `Submitted; check confirmation before retrying. ${error.message}` });
    return Response.json({ error: error.message || 'Token payment test failed.' }, { status: 400 });
  }
}