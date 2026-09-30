import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { PublicKey, Transaction } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@5.0.0';
import { secrets } from 'base44:runtime';
import { rpc, getProtocolConfig } from '../../shared/solanaRpc.ts';
import { HANDLE_MINT, handlePaymentStatus } from '../../shared/handlePaymentStatus.ts';
import { verifyHandleMint } from '../../shared/handleTokenMintInfo.ts';
import { lookupAddresses, lookupSettings, readFrozenLookup, lookupSetupInstructions } from '../../shared/tokenPaymentLookup.ts';
import { fromBase64 } from '../../shared/handleTokenTransactions.ts';
import { previewTokenTransaction } from '../../shared/tokenMintFlow.ts';
import validateTokenConfiguration from '../../shared/validateTokenConfiguration.ts';
import tokenLookupChecks from '../../shared/tokenLookupChecks.ts';
export default async function(req: Request): Promise<Response> {
  let broadcastSignature = '';
  try {
    const base44 = createClientFromRequest(req), user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Administrator access is required.' }, { status: 403 });
    const body = await req.json();
    if (body.action === 'validate_codec') return Response.json(await tokenLookupChecks());
    if (!['status', 'prepare', 'submit', 'activate'].includes(body.action)) return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (await rpc(rpcUrl, 'getGenesisHash') !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('Lookup setup requires Solana mainnet.');
    const protocol = await getProtocolConfig(rpcUrl), payment = await handlePaymentStatus(rpcUrl);
    if (!payment.enabledOnChain) throw new Error('Configure on-chain token payments first.');
    const mintAccount = await rpc(rpcUrl, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const addresses = lookupAddresses(protocol, payment, new PublicKey(verifyHandleMint(mintAccount.value).tokenProgram));
    const settings = await lookupSettings(base44);
    if (body.action === 'status') {
      const table = settings?.token_payment_lookup_table ? await readFrozenLookup(rpcUrl, settings.token_payment_lookup_table, addresses) : null;
      const rentLamports = await rpc(rpcUrl, 'getMinimumBalanceForRentExemption', [56 + addresses.length * 32]);
      return Response.json({ authority: protocol.authority, active: Boolean(table), address: table?.key.toBase58() || null, rentLamports, accountCount: addresses.length });
    }
    if (body.action === 'activate') {
      const table = await readFrozenLookup(rpcUrl, body.address, addresses);
      if (!table) {
        if (!/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(body.signature || '')) throw new Error('Invalid setup signature.');
        const status = (await rpc(rpcUrl, 'getSignatureStatuses', [[body.signature], { searchTransactionHistory: true }])).value?.[0];
        if (status?.err) return Response.json({ status: 'failed', error: `Setup failed: ${JSON.stringify(status.err)}` });
        if (!status && body.blockhash && !(await rpc(rpcUrl, 'isBlockhashValid', [body.blockhash, { commitment: 'confirmed' }])).value) return Response.json({ status: 'expired', error: 'Setup expired without confirmation. Prepare a new setup.' });
        return Response.json({ status: 'pending' });
      }
      if (settings) await base44.entities.TokenLaunchSettings.update(settings.id, { token_payment_lookup_table: table.key.toBase58() });
      else await base44.entities.TokenLaunchSettings.create({ token_mint_address: HANDLE_MINT, token_payment_lookup_table: table.key.toBase58() });
      return Response.json({ status: 'active', address: table.key.toBase58() });
    }
    if (settings?.token_payment_lookup_table) throw new Error('A lookup table is already configured; refresh its status instead of creating another.');
    const authority = new PublicKey(protocol.authority);
    if (body.action === 'prepare') {
      if (body.wallet !== protocol.authority) throw new Error(`Connect the protocol authority wallet: ${protocol.authority}`);
      const recentSlot = await rpc(rpcUrl, 'getSlot', [{ commitment: 'finalized' }]);
      const setup = lookupSetupInstructions(authority, recentSlot, addresses);
      return Response.json({ address: setup.address.toBase58(), recentSlot, transaction_base64: await previewTokenTransaction(rpcUrl, authority, setup.instructions) });
    }
    if (typeof body.transaction_base64 !== 'string' || body.transaction_base64.length > 1700) throw new Error('Invalid setup transaction.');
    const tx = Transaction.from(fromBase64(body.transaction_base64));
    const setup = lookupSetupInstructions(authority, body.recentSlot, addresses);
    if (body.address !== setup.address.toBase58()) throw new Error('The setup address does not match the reviewed slot.');
    validateTokenConfiguration(tx, setup.instructions, authority);
    if (!(await rpc(rpcUrl, 'isBlockhashValid', [tx.recentBlockhash, { commitment: 'confirmed' }])).value) throw new Error('Setup expired before submission.');
    broadcastSignature = bs58.encode(tx.signature);
    const signature = await rpc(rpcUrl, 'sendTransaction', [body.transaction_base64, { encoding: 'base64', preflightCommitment: 'confirmed' }]);
    return Response.json({ signature, address: setup.address.toBase58(), status: 'pending' });
  } catch (error) {
    if (broadcastSignature) return Response.json({ signature: broadcastSignature, status: 'pending', error: 'Submission may have reached Solana. Check the saved setup before retrying.' });
    return Response.json({ error: error.message || 'Lookup setup failed.' }, { status: 400 });
  }
}