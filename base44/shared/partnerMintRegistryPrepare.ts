import { PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction, SystemProgram } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { PROGRAM, pda, enc, sha, str, u64, concat, b64, fault } from './partnerMintCodec.ts';
import { registryId, registryState, registryPartnerLink } from './partnerMintRegistryState.ts';
export default async function registryPrepare(base44, user, body, url, signer) {
  const operation = body.operation, id = operation === 'settings' ? '' : registryId(body.partnerId);
  if (!['create', 'status', 'wallet', 'settings'].includes(operation)) fault('INVALID_OPERATION', 400);
  const state = await registryState(url, id, 'confirmed');
  if (body.authority !== state.authority) fault('AUTHORITY_WALLET_REQUIRED', 403, 'Connect the on-chain Devnet protocol authority wallet to prepare a registry change.');
  const key = (address, isWritable = false, isSigner = false) => ({ pubkey: new PublicKey(address), isWritable, isSigner });
  const partner = id ? pda('partner', await sha(enc(id))) : null;
  let keys, data, name; const desired = {};
  if (operation === 'settings') {
    if (typeof body.enabled !== 'boolean') fault('INVALID_SETTINGS', 400);
    desired.enabled = body.enabled; desired.quoteSigner = signer.publicKey.toBase58();
    name = 'configure_partner_mint'; keys = [key(state.authority, true, true), key(pda('config')), key(pda('partner_mint'), true), key(pda('token_payment')), key(SystemProgram.programId)]; data = concat(Uint8Array.of(body.enabled ? 1 : 0), signer.publicKey.toBytes());
  } else {
    if (operation === 'create' && state.partner) fault('PARTNER_ALREADY_EXISTS', 409);
    if (operation !== 'create' && !state.partner) fault('PARTNER_NOT_FOUND', 404);
    if (operation !== 'create' && body.revision !== state.partner.revision) fault('STALE_REVISION', 409);
    if (operation === 'status') {
      const index = ['approved', 'suspended', 'disabled'].indexOf(body.status); if (index < 0) fault('INVALID_STATUS', 400);
      desired.status = body.status; name = 'set_mint_partner_status'; keys = [key(state.authority, false, true), key(pda('config')), key(partner, true)]; data = concat(str(id), u64(state.partner.revision), Uint8Array.of(index));
    } else {
      let wallet; try { wallet = new PublicKey(body.revenueWallet).toBase58(); } catch { fault('INVALID_WALLET', 400); }
      if (wallet !== body.revenueWallet || wallet === state.treasury || wallet === state.authority || wallet === signer.publicKey.toBase58()) fault('INVALID_REVENUE_WALLET', 400);
      const account = await rpc(url, 'getAccountInfo', [wallet, { encoding: 'base64', commitment: 'confirmed' }]);
      if (account.value && (account.value.owner !== SystemProgram.programId.toBase58() || account.value.executable || account.value.data?.[0])) fault('INVALID_REVENUE_WALLET', 400);
      desired.revenueWallet = wallet;
      if (operation === 'create') { name = 'create_mint_partner'; keys = [key(state.authority, true, true), key(pda('config')), key(pda('partner_mint')), key(partner, true), key(wallet, false, true), key(SystemProgram.programId)]; data = str(id); }
      else { if (wallet === state.partner.revenue_wallet) fault('WALLET_UNCHANGED', 409); name = 'change_mint_partner_wallet'; keys = [key(state.authority, false, true), key(pda('config')), key(partner, true), key(wallet, false, true)]; data = concat(str(id), u64(state.partner.revision)); }
    }
    desired.revision = operation === 'create' ? '1' : (BigInt(state.partner.revision) + 1n).toString();
  }
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 80) : '';
  if (operation === 'create') desired.partnerLink = (await registryPartnerLink(base44, body.partnerLink)) || '';
  const latest = await rpc(url, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
  const ix = new TransactionInstruction({ programId: PROGRAM, keys, data: concat((await sha(enc(`global:${name}`))).slice(0, 8), data) });
  const tx = new VersionedTransaction(new TransactionMessage({ payerKey: new PublicKey(state.authority), recentBlockhash: latest.value.blockhash, instructions: [ix] }).compileToV0Message());
  const unsigned = b64(tx.serialize()), simulation = await rpc(url, 'simulateTransaction', [unsigned, { encoding: 'base64', sigVerify: false, commitment: 'confirmed' }]);
  if (!simulation?.value || simulation.value.err) fault('REGISTRY_SIMULATION_FAILED', 422, 'Devnet registry simulation failed. Check authority funding and current chain state; nothing was broadcast.');
  const intent = await base44.entities.PartnerMintAdminIntent.create({ cluster: 'devnet', admin_user_id: user.id, partner_id: id, operation, display_name: displayName, unsigned_transaction: unsigned, message_hash: b64(await sha(tx.message.serialize())), last_valid_block_height: latest.value.lastValidBlockHeight, status: 'PREPARED', signature: '', desired_state: desired });
  if (operation === 'create') await base44.entities.PartnerMintProfile.upsert([{ profile_key: `devnet:${id}`, cluster: 'devnet', partner_id: id, display_name: displayName || id, partner_link: desired.partnerLink, status: 'pending' }], { key: 'profile_key' });
  return { intentId: intent.id, operation, partnerId: id, desired, transactionBase64: unsigned, requiredSigners: tx.message.staticAccountKeys.slice(0, tx.message.header.numRequiredSignatures).map(k => k.toBase58()), status: 'PREPARED' };
}