import { passportChain, passportCreator, PASSPORT_VERSION } from './tokenPassportChain.ts';
import { profileError } from './handleProfileProof.ts';
export async function passportEnrollment(db, url, pilot, input, proof, signature) {
  const found = await db.TokenPassportEnrollment.filter({ pilot_id: pilot.id, wallet: input.wallet }, { limit: 1 }); let entry = found.items[0];
  if (input.operation === 'withdraw') {
    if (!entry) throw profileError('Geen deelname gevonden.', 404);
    await db.TokenPassportEnrollment.update(entry.id, { status: 'withdrawn', reason: 'Ingetrokken door wallet-eigenaar.' });
    await db.TokenPassport.updateMany({ enrollment_id: entry.id, status: 'published' }, { $set: { status: 'withdrawn' } });
    return { withdrawn: true };
  }
  const now = new Date().toISOString();
  if (now < pilot.starts_at || now >= pilot.ends_at) throw profileError('De vierweekse registratieperiode is niet open.', 409);
  if (entry?.status === 'withdrawn' || entry?.status === 'ineligible' && entry.reason?.startsWith('Beheer:')) throw profileError('Deze deelname is ingetrokken of uitgesloten.', 403);
  if (entry?.status === 'completed') return { completed: true, passport_key: entry.passport_key };
  if (input.operation === 'publish' && (!entry?.eligible || entry.status !== 'started' || entry.handle !== input.handle || entry.mint !== input.mint)) throw profileError('Controleer eerst je handle en tokenmint via de startstap.', 409);
  if (!entry) {
    let source = 'open';
    if (input.invite) { const invitation = await db.TokenPassportInvitation.filter({ pilot_id: pilot.id, code: input.invite }, { limit: 1 }); if (!invitation.items.length) throw profileError('Deze uitnodigingslink is ongeldig.'); source = 'invited'; }
    entry = await db.TokenPassportEnrollment.create({ pilot_id: pilot.id, wallet: input.wallet, handle: input.handle, mint: input.mint, source, maker_type: input.maker_type, status: 'applied', eligible: false });
  }
  let chain;
  try { chain = await passportChain(url, input); } catch (error) {
    if ([400,403].includes(error.status) && !entry.started_at) await db.TokenPassportEnrollment.update(entry.id, { status: 'ineligible', eligible: false, reason: error.message });
    throw error;
  }
  if (input.operation === 'start') {
    await db.TokenPassportEnrollment.update(entry.id, { handle: input.handle, mint: input.mint, status: 'started', eligible: true, started_at: entry.started_at || now, reason: '' });
    return { started: true, chain };
  }
  const creator = await passportCreator(url, input);
  // A random, stable public key makes retry after a partial save idempotent.
  const key = entry.passport_key || crypto.randomUUID();
  if (!entry.passport_key) await db.TokenPassportEnrollment.update(entry.id, { passport_key: key });
  const previous = await db.TokenPassport.filter({ enrollment_id: entry.id }, { limit: 1 });
  const fields = { key, pilot_id: pilot.id, enrollment_id: entry.id, wallet: input.wallet, handle: input.handle, asset: chain.identity.assetAddress, mint: input.mint, project_name: input.project_name, description: input.description, network: 'mainnet-beta', status: 'published', checked_at: chain.checked_at, token: chain.token, creator, message: proof.message, signature, proof_version: PASSPORT_VERSION };
  if (!previous.items.length) await db.TokenPassport.create(fields);
  else if (previous.items[0].status !== 'published') throw profileError('Deze registratie is ingetrokken.', 409);
  await db.TokenPassportEnrollment.update(entry.id, { status: 'completed', completed_at: new Date().toISOString(), passport_key: previous.items[0]?.key || key });
  return { completed: true, passport_key: previous.items[0]?.key || key };
}